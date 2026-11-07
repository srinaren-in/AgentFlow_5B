import pytest
from app.agent.state import AgentState
from app.agent.graph import tool_execution_node, should_continue, build_agent_graph
from langgraph.graph import END

@pytest.mark.asyncio
async def test_agent_tool_execution_node():
    state: AgentState = {
        "goal": "Calculate 50 * 4",
        "system_instructions": "",
        "messages": [],
        "current_step": 0,
        "max_steps": 5,
        "tool_names": ["calculator"],
        "tool_calls": [{"name": "calculator", "args": {"expression": "50 * 4"}}],
        "intermediate_steps": [],
        "final_output": None,
        "status": "running",
        "logs": [],
        "provider_name": "ollama",
        "model_name": "qwen2.5:7b",
    }

    result = await tool_execution_node(state)
    assert result["current_step"] == 1
    assert len(result["intermediate_steps"]) == 1
    step = result["intermediate_steps"][0]
    assert step["action"] == "calculator"
    assert step["observation"]["result"] == 200
    assert result["tool_calls"] == []

def test_should_continue_logic():
    # If final output exists -> END
    state1: AgentState = {"final_output": "The answer is 200", "tool_calls": [], "current_step": 1, "max_steps": 5}
    assert should_continue(state1) == END

    # If tool calls pending and step < max -> 'tool_execution'
    state2: AgentState = {"final_output": None, "tool_calls": [{"name": "calc"}], "current_step": 0, "max_steps": 5}
    assert should_continue(state2) == "tool_execution"

    # If max steps reached -> END
    state3: AgentState = {"final_output": None, "tool_calls": [{"name": "calc"}], "current_step": 5, "max_steps": 5}
    assert should_continue(state3) == END

def test_build_agent_graph():
    graph = build_agent_graph()
    compiled = graph.compile()
    assert compiled is not None

