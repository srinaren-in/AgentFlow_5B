import asyncio
import time
import uuid
from typing import Dict, Any, List
from datetime import datetime, timezone
from collections import defaultdict

from app.schemas.workflow import WorkflowDefinitionSchema
from app.schemas.execution import ExecutionResponse, NodeExecutionState, ExecutionLogEntry
from app.workflow.validator import validate_workflow
from app.workflow.nodes.base import ExecutionContext
from app.workflow.nodes import NODE_EXECUTORS
from app.core.config import settings

class WorkflowEngine:
    async def execute(
        self,
        workflow: WorkflowDefinitionSchema,
        inputs: Dict[str, Any] = None,
        timeout_seconds: int = None,
    ) -> ExecutionResponse:
        execution_id = f"exec_{uuid.uuid4().hex[:12]}"
        start_time_iso = datetime.now(timezone.utc).isoformat()
        start_time_perf = time.perf_counter()
        timeout = timeout_seconds or settings.DEFAULT_TIMEOUT_SECONDS

        inputs = inputs or {}
        context = ExecutionContext(inputs=inputs, timeout_seconds=timeout)
        context.log("INFO", f"Starting workflow execution '{workflow.name}' (ID: {execution_id})")

        # 1. Validate DAG & compute topological execution order
        validation = validate_workflow(workflow)
        if not validation.is_valid:
            error_msg = f"Workflow validation failed: {'; '.join(validation.errors)}"
            context.log("ERROR", error_msg)
            return ExecutionResponse(
                execution_id=execution_id,
                workflow_id=workflow.id,
                status="failed",
                result={},
                node_states={},
                logs=[ExecutionLogEntry(**entry) for entry in context.logs],
                error=error_msg,
                start_time=start_time_iso,
                end_time=datetime.now(timezone.utc).isoformat(),
                duration_ms=(time.perf_counter() - start_time_perf) * 1000,
            )

        # 2. Build lookups
        nodes_by_id = {node.id: node for node in workflow.nodes}
        # Incoming edges map: target_node_id -> List[Edge]
        incoming_edges: Dict[str, List] = defaultdict(list)
        # Outgoing edges map: source_node_id -> List[Edge]
        outgoing_edges: Dict[str, List] = defaultdict(list)

        for edge in workflow.edges:
            incoming_edges[edge.target].append(edge)
            outgoing_edges[edge.source].append(edge)

        # Initial node states
        node_states: Dict[str, NodeExecutionState] = {}
        for node in workflow.nodes:
            node_states[node.id] = NodeExecutionState(
                node_id=node.id,
                node_type=node.type,
                status="pending",
                inputs={},
                outputs={},
            )

        # Inactive branch tracking for conditional routing
        skipped_nodes = set()
        final_result = {}
        overall_status = "completed"
        overall_error = None

        # 3. Execute nodes in topological order with global timeout protection
        async def _run_pipeline():
            nonlocal overall_status, overall_error, final_result

            for node_id in validation.execution_order:
                node = nodes_by_id[node_id]

                # Check if this node should be skipped (e.g. inactive conditional branch)
                if node_id in skipped_nodes:
                    node_states[node_id].status = "skipped"
                    context.log("INFO", f"Node '{node.data.label}' skipped (inactive branch).", node_id)
                    continue

                node_states[node_id].status = "running"
                context.log("INFO", f"Executing node '{node.data.label}' ({node.type})", node_id)

                # Gather node inputs from incoming edges
                node_inputs: Dict[str, Any] = {}
                for edge in incoming_edges[node_id]:
                    source_outputs = context.node_outputs.get(edge.source, {})
                    source_handle = edge.sourceHandle or "output"
                    target_handle = edge.targetHandle or "input"

                    # If source handle matches an output key
                    val = source_outputs.get(source_handle)
                    if val is None and len(source_outputs) == 1:
                        val = next(iter(source_outputs.values()))

                    if val is not None:
                        node_inputs[target_handle] = val
                        # Also map clean variable names if target_handle is var_query -> query
                        if target_handle.startswith("var_"):
                            node_inputs[target_handle[4:]] = val

                node_states[node_id].inputs = node_inputs
                node_start = time.perf_counter()

                # Execute node using registered executor
                executor = NODE_EXECUTORS.get(node.type)
                if not executor:
                    err = f"No executor registered for node type '{node.type}'"
                    node_states[node_id].status = "failed"
                    node_states[node_id].error = err
                    context.log("ERROR", err, node_id)
                    overall_status = "failed"
                    overall_error = err
                    break

                try:
                    outputs = await executor.execute(
                        node_id=node.id,
                        inputs=node_inputs,
                        config=node.data.config or {},
                        context=context,
                    )
                    node_duration = (time.perf_counter() - node_start) * 1000
                    node_states[node_id].status = "completed"
                    node_states[node_id].outputs = outputs
                    node_states[node_id].duration_ms = node_duration
                    context.node_outputs[node.id] = outputs

                    # Handle conditional branching: if conditional node, deactivate edges of other branch
                    if node.type == "conditionalNode":
                        selected_branch = outputs.get("branch")  # 'true_branch' or 'false_branch'
                        for out_edge in outgoing_edges[node.id]:
                            # If edge leaves from the other handle, skip downstream target
                            if out_edge.sourceHandle and out_edge.sourceHandle != selected_branch:
                                skipped_nodes.add(out_edge.target)

                    # Capture final result from output node
                    if node.type == "outputNode":
                        final_result.update(outputs)

                except Exception as exc:
                    node_duration = (time.perf_counter() - node_start) * 1000
                    node_states[node_id].status = "failed"
                    node_states[node_id].duration_ms = node_duration
                    node_states[node_id].error = str(exc)
                    context.log("ERROR", f"Execution error in node '{node.data.label}': {str(exc)}", node_id)
                    overall_status = "failed"
                    overall_error = str(exc)
                    break

        try:
            await asyncio.wait_for(_run_pipeline(), timeout=timeout)
        except asyncio.TimeoutError:
            overall_status = "failed"
            overall_error = f"Workflow exceeded timeout limit of {timeout} seconds."
            context.log("ERROR", overall_error)

        duration_total = (time.perf_counter() - start_time_perf) * 1000
        context.log("INFO", f"Execution finished with status '{overall_status}' in {duration_total:.1f}ms")

        # Fallback for result if no outputNode present
        if not final_result and overall_status == "completed":
            final_result = {
                nid: state.outputs for nid, state in node_states.items() if state.status == "completed"
            }

        return ExecutionResponse(
            execution_id=execution_id,
            workflow_id=workflow.id,
            status=overall_status,
            result=final_result,
            node_states=node_states,
            logs=[ExecutionLogEntry(**entry) for entry in context.logs],
            error=overall_error,
            start_time=start_time_iso,
            end_time=datetime.now(timezone.utc).isoformat(),
            duration_ms=duration_total,
        )

workflow_engine = WorkflowEngine()
