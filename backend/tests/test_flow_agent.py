import pytest
from app.tools.wikipedia_tool import WikipediaSearchTool
from app.flow_agent.roles import (
    PlannerRole,
    ExecutorRole,
    VerifierRole,
    GeneratorRole,
    NextStepPlan,
    VerificationVerdict,
)
from app.flow_agent.solver import FlowSolver

@pytest.mark.asyncio
async def test_wikipedia_tool_structure():
    tool = WikipediaSearchTool()
    assert tool.name == "wikipedia_search"
    res = await tool.execute(query="Artificial Intelligence", limit=2)
    assert "query" in res
    assert "results" in res
    assert isinstance(res["results"], list)

@pytest.mark.asyncio
async def test_executor_role_calculator():
    executor = ExecutorRole()
    res = await executor.execute("calculator", {"expression": "25 * 4"})
    assert res["success"] is True
    assert res["output"]["result"] == 100

@pytest.mark.asyncio
async def test_verifier_role_evaluation():
    verifier = VerifierRole(provider_name="gemini")
    
    # Positive case
    verdict_pos = await verifier.verify(
        query="Compute square of 12",
        subgoal="Calculate 12 * 12",
        tool_name="calculator",
        tool_args={"expression": "12 * 12"},
        observation={"result": 144},
    )
    assert isinstance(verdict_pos, VerificationVerdict)
    assert verdict_pos.is_valid is True

    # Error case
    verdict_neg = await verifier.verify(
        query="Read invalid resource",
        subgoal="Trigger invalid calculation",
        tool_name="calculator",
        tool_args={"expression": "1 / 0"},
        observation={"error": "division by zero"},
    )
    assert verdict_neg.is_valid is False

@pytest.mark.asyncio
async def test_flow_solver_execution():
    solver = FlowSolver(
        provider_name="ollama",
        model_name="qwen2.5:7b",
        max_turns=2,
        available_tools=["calculator"],
        system_role="Mathematical Researcher",
    )
    
    logs = []
    def log_cb(level, msg):
        logs.append(f"[{level}] {msg}")

    result = await solver.solve(
        query="Calculate 50 + 50 using calculator.",
        log_callback=log_cb,
    )

    assert result["status"] == "completed"
    assert "final_output" in result
    assert "trajectory" in result
    assert len(logs) > 0

