import pytest
from app.schemas.workflow import WorkflowDefinitionSchema, EdgeSchema
from app.schemas.node import NodeSchema, NodeData
from app.workflow.engine import workflow_engine

@pytest.mark.asyncio
async def test_conditional_branching():
    # Input -> Conditional -> True Output / False Output
    workflow = WorkflowDefinitionSchema(
        id="cond_wf",
        name="Conditional Routing Test",
        nodes=[
            NodeSchema(
                id="input_1",
                type="inputNode",
                data=NodeData(nodeType="inputNode", label="In", config={"variableName": "query"}),
            ),
            NodeSchema(
                id="cond_1",
                type="conditionalNode",
                data=NodeData(
                    nodeType="conditionalNode",
                    label="Condition",
                    config={"field": "query", "operator": "contains", "value": "urgent"},
                ),
            ),
            NodeSchema(
                id="true_out",
                type="outputNode",
                data=NodeData(nodeType="outputNode", label="Urgent Handler", config={"responseKey": "route"}),
            ),
            NodeSchema(
                id="false_out",
                type="outputNode",
                data=NodeData(nodeType="outputNode", label="Standard Handler", config={"responseKey": "route"}),
            ),
        ],
        edges=[
            EdgeSchema(id="e1", source="input_1", target="cond_1", sourceHandle="output", targetHandle="input"),
            EdgeSchema(id="e2", source="cond_1", target="true_out", sourceHandle="true_branch", targetHandle="input"),
            EdgeSchema(id="e3", source="cond_1", target="false_out", sourceHandle="false_branch", targetHandle="input"),
        ],
    )

    # Test True branch
    true_run = await workflow_engine.execute(workflow=workflow, inputs={"query": "This is urgent!"})
    assert true_run.status == "completed"
    assert true_run.node_states["true_out"].status == "completed"
    assert true_run.node_states["false_out"].status == "skipped"

    # Test False branch
    false_run = await workflow_engine.execute(workflow=workflow, inputs={"query": "Normal question."})
    assert false_run.status == "completed"
    assert false_run.node_states["true_out"].status == "skipped"
    assert false_run.node_states["false_out"].status == "completed"

