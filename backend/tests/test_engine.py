import pytest
from app.schemas.workflow import WorkflowDefinitionSchema, EdgeSchema
from app.schemas.node import NodeSchema, NodeData
from app.workflow.engine import workflow_engine

@pytest.mark.asyncio
async def test_input_prompt_output_pipeline():
    workflow = WorkflowDefinitionSchema(
        id="test_pipeline",
        name="Linear Input Prompt Output",
        nodes=[
            NodeSchema(
                id="input_1",
                type="inputNode",
                data=NodeData(
                    nodeType="inputNode",
                    label="User Query",
                    config={"variableName": "topic", "defaultValue": "FastAPI"},
                ),
            ),
            NodeSchema(
                id="prompt_1",
                type="promptTemplateNode",
                data=NodeData(
                    nodeType="promptTemplateNode",
                    label="Prompt Builder",
                    config={"template": "Build high performance APIs using {topic}."},
                ),
            ),
            NodeSchema(
                id="output_1",
                type="outputNode",
                data=NodeData(
                    nodeType="outputNode",
                    label="Final Output",
                    config={"responseKey": "rendered_text"},
                ),
            ),
        ],
        edges=[
            EdgeSchema(id="e1", source="input_1", target="prompt_1", sourceHandle="output", targetHandle="topic"),
            EdgeSchema(id="e2", source="prompt_1", target="output_1", sourceHandle="formatted_prompt", targetHandle="input"),
        ],
    )

    # Execute with custom runtime inputs
    response = await workflow_engine.execute(
        workflow=workflow,
        inputs={"topic": "LangGraph Orchestration"},
    )

    assert response.status == "completed"
    assert response.result.get("rendered_text") == "Build high performance APIs using LangGraph Orchestration."
    assert response.node_states["input_1"].status == "completed"
    assert response.node_states["prompt_1"].status == "completed"
    assert response.node_states["output_1"].status == "completed"
    assert len(response.logs) >= 3
