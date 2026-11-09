import pytest
from app.schemas.workflow import WorkflowDefinitionSchema, EdgeSchema
from app.schemas.node import NodeSchema, NodeData
from app.workflow.engine import workflow_engine

@pytest.mark.asyncio
async def test_e2e_full_llm_pipeline():
    """
    End-to-end verification of the standard 4-node pipeline:
    User Input -> Prompt Template -> LLM Reasoning -> Formatted Output.
    """
    workflow = WorkflowDefinitionSchema(
        id="e2e_llm_flow",
        name="E2E Question Answering Pipeline",
        nodes=[
            NodeSchema(
                id="in_1",
                type="inputNode",
                data=NodeData(
                    nodeType="inputNode",
                    label="User Query",
                    config={"variableName": "query", "defaultValue": "What is AgentFlow?"},
                ),
            ),
            NodeSchema(
                id="prompt_1",
                type="promptTemplateNode",
                data=NodeData(
                    nodeType="promptTemplateNode",
                    label="Instruction Builder",
                    config={"template": "Explain {query} with architectural clarity."},
                ),
            ),
            NodeSchema(
                id="llm_1",
                type="llmNode",
                data=NodeData(
                    nodeType="llmNode",
                    label="Qwen 2.5 / Gemini",
                    config={"provider": "ollama", "model": "qwen2.5:7b", "temperature": 0.5},
                ),
            ),
            NodeSchema(
                id="out_1",
                type="outputNode",
                data=NodeData(
                    nodeType="outputNode",
                    label="Final Answer",
                    config={"responseKey": "final_answer", "outputFormat": "markdown"},
                ),
            ),
        ],
        edges=[
            EdgeSchema(id="e1", source="in_1", target="prompt_1", sourceHandle="output", targetHandle="var_query"),
            EdgeSchema(id="e2", source="prompt_1", target="llm_1", sourceHandle="formatted_prompt", targetHandle="prompt"),
            EdgeSchema(id="e3", source="llm_1", target="out_1", sourceHandle="response", targetHandle="input"),
        ],
    )

    result = await workflow_engine.execute(
        workflow=workflow,
        inputs={"query": "Explain autonomous agents"},
    )

    assert result.status == "completed"
    assert result.workflow_id == "e2e_llm_flow"
    assert "in_1" in result.node_states
    assert "prompt_1" in result.node_states
    assert "llm_1" in result.node_states
    assert "out_1" in result.node_states
    assert result.node_states["out_1"].status == "completed"
    assert "final_answer" in result.result
    assert len(result.logs) >= 4

@pytest.mark.asyncio
async def test_e2e_agent_4role_pipeline():
    """
    End-to-end test of the AgentFlow 4-role Cognitive Loop node (Planner->Executor->Verifier->Generator).
    """
    workflow = WorkflowDefinitionSchema(
        id="e2e_4role_agent_flow",
        name="E2E 4-Role Cognitive Agent Pipeline",
        nodes=[
            NodeSchema(
                id="agent_1",
                type="agentNode",
                data=NodeData(
                    nodeType="agentNode",
                    label="4-Role Flow Agent",
                    config={
                        "role": "Scientific Problem Solver",
                        "architecture": "flow_4role",
                        "model": "qwen2.5:7b",
                        "provider": "ollama",
                        "maxIterations": 2,
                        "toolsEnabled": ["calculator"],
                        "goal": "Calculate 15 * 15 and verify result",
                    },
                ),
            ),
            NodeSchema(
                id="out_1",
                type="outputNode",
                data=NodeData(
                    nodeType="outputNode",
                    label="Verified Output",
                    config={"responseKey": "agent_solution"},
                ),
            ),
        ],
        edges=[
            EdgeSchema(id="e1", source="agent_1", target="out_1", sourceHandle="result", targetHandle="input"),
        ],
    )

    result = await workflow_engine.execute(
        workflow=workflow,
        inputs={"goal": "Compute 25 * 4"},
    )

    assert result.status == "completed"
    assert "agent_1" in result.node_states
    assert result.node_states["agent_1"].status == "completed"
    assert "agent_solution" in result.result
    trajectory = result.node_states["agent_1"].outputs.get("trajectory", [])
    assert isinstance(trajectory, list)

@pytest.mark.asyncio
async def test_e2e_sandboxed_python_tool_pipeline():
    """
    End-to-end test of the Subprocess Python Sandbox node.
    """
    workflow = WorkflowDefinitionSchema(
        id="e2e_python_sandbox_flow",
        name="E2E Python Sandbox Execution",
        nodes=[
            NodeSchema(
                id="py_1",
                type="pythonToolNode",
                data=NodeData(
                    nodeType="pythonToolNode",
                    label="Sandboxed Python Runner",
                    config={
                        "code": "result = [x**2 for x in range(1, 6)]\nprint('Computed:', result)",
                        "timeout": 5,
                    },
                ),
            ),
            NodeSchema(
                id="out_1",
                type="outputNode",
                data=NodeData(
                    nodeType="outputNode",
                    label="Python Execution Output",
                    config={"responseKey": "python_out"},
                ),
            ),
        ],
        edges=[
            EdgeSchema(id="e1", source="py_1", target="out_1", sourceHandle="result", targetHandle="input"),
        ],
    )

    result = await workflow_engine.execute(workflow=workflow)
    assert result.status == "completed"
    assert result.node_states["py_1"].status == "completed"
    assert "python_out" in result.result

