from typing import List, Dict, Set, Tuple
from collections import defaultdict, deque
from app.schemas.workflow import WorkflowDefinitionSchema, WorkflowValidationResponse

def validate_workflow(workflow: WorkflowDefinitionSchema) -> WorkflowValidationResponse:
    errors: List[str] = []
    warnings: List[str] = []

    node_ids = {node.id for node in workflow.nodes}
    if not node_ids:
        return WorkflowValidationResponse(
            is_valid=False,
            errors=["Workflow contains no nodes."],
            warnings=[],
            execution_order=[],
            entry_nodes=[],
            exit_nodes=[],
        )

    # Adjacency graph and in-degrees
    adj: Dict[str, List[str]] = defaultdict(list)
    in_degree: Dict[str, int] = {nid: 0 for nid in node_ids}
    incoming_edges: Dict[str, List] = defaultdict(list)

    for edge in workflow.edges:
        if edge.source not in node_ids:
            errors.append(f"Edge references non-existent source node '{edge.source}'.")
            continue
        if edge.target not in node_ids:
            errors.append(f"Edge references non-existent target node '{edge.target}'.")
            continue
        if edge.source == edge.target:
            errors.append(f"Self-loop detected: Node '{edge.source}' connects to itself.")
            continue

        adj[edge.source].append(edge.target)
        in_degree[edge.target] += 1
        incoming_edges[edge.target].append(edge)

    # Cycle detection via Kahn's algorithm (Topological sort)
    queue = deque([nid for nid in node_ids if in_degree[nid] == 0])
    entry_nodes = list(queue)
    execution_order: List[str] = []

    # Temporary copy of in_degree for Kahn's
    in_deg_copy = in_degree.copy()

    while queue:
        curr = queue.popleft()
        execution_order.append(curr)

        for neighbor in adj[curr]:
            in_deg_copy[neighbor] -= 1
            if in_deg_copy[neighbor] == 0:
                queue.append(neighbor)

    if len(execution_order) != len(node_ids):
        # A cycle exists!
        visited_nodes = set(execution_order)
        cycle_candidates = [nid for nid in node_ids if nid not in visited_nodes]
        errors.append(
            f"Cyclic dependency detected among nodes: {', '.join(cycle_candidates)}. Workflows must be Directed Acyclic Graphs (DAG)."
        )

    # Detect exit nodes (out-degree == 0)
    exit_nodes = [nid for nid in node_ids if len(adj[nid]) == 0]

    # Validate node specific requirements
    has_input = any(n.type == "inputNode" for n in workflow.nodes)
    has_output = any(n.type == "outputNode" for n in workflow.nodes)

    if not has_input:
        warnings.append("Workflow has no Input Node. Consider adding one to accept user payloads.")
    if not has_output:
        warnings.append("Workflow has no Output Node. Pipeline results will return raw terminal node states.")

    is_valid = len(errors) == 0

    return WorkflowValidationResponse(
        is_valid=is_valid,
        errors=errors,
        warnings=warnings,
        execution_order=execution_order if is_valid else [],
        entry_nodes=entry_nodes,
        exit_nodes=exit_nodes,
    )
