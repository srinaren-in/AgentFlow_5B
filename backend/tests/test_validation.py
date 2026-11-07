import pytest
from app.schemas.workflow import WorkflowDefinitionSchema
from app.schemas.node import NodeSchema, NodeData
from app.schemas.workflow import EdgeSchema
from app.workflow.validator import validate_workflow

def test_valid_dag_workflow():
    workflow = WorkflowDefinitionSchema(
        id="test_wf",
        name="Valid Workflow",
        nodes=[
            NodeSchema(id="n1", type="inputNode", data=NodeData(nodeType="inputNode", label="In")),
            NodeSchema(id="n2", type="promptTemplateNode", data=NodeData(nodeType="promptTemplateNode", label="Prompt")),
            NodeSchema(id="n3", type="outputNode", data=NodeData(nodeType="outputNode", label="Out")),
        ],
        edges=[
            EdgeSchema(id="e1", source="n1", target="n2"),
            EdgeSchema(id="e2", source="n2", target="n3"),
        ],
    )

    result = validate_workflow(workflow)
    assert result.is_valid is True
    assert result.execution_order == ["n1", "n2", "n3"]
    assert len(result.errors) == 0

def test_cycle_detection():
    # n1 -> n2 -> n3 -> n1 (Cycle!)
    workflow = WorkflowDefinitionSchema(
        id="cycle_wf",
        name="Cyclic Workflow",
        nodes=[
            NodeSchema(id="n1", type="inputNode", data=NodeData(nodeType="inputNode", label="N1")),
            NodeSchema(id="n2", type="llmNode", data=NodeData(nodeType="llmNode", label="N2")),
            NodeSchema(id="n3", type="outputNode", data=NodeData(nodeType="outputNode", label="N3")),
        ],
        edges=[
            EdgeSchema(id="e1", source="n1", target="n2"),
            EdgeSchema(id="e2", source="n2", target="n3"),
            EdgeSchema(id="e3", source="n3", target="n1"),
        ],
    )

    result = validate_workflow(workflow)
    assert result.is_valid is False
    assert any("Cyclic dependency" in err for err in result.errors)

def test_self_loop():
    workflow = WorkflowDefinitionSchema(
        id="self_loop_wf",
        name="Self Loop Workflow",
        nodes=[
            NodeSchema(id="n1", type="inputNode", data=NodeData(nodeType="inputNode", label="N1")),
        ],
        edges=[
            EdgeSchema(id="e1", source="n1", target="n1"),
        ],
    )

    result = validate_workflow(workflow)
    assert result.is_valid is False
    assert any("Self-loop" in err for err in result.errors)

