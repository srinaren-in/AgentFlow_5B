import pytest
from app.tools.calculator import CalculatorTool
from app.tools.python_sandbox import PythonSandboxTool
from app.tools.registry import tool_registry

@pytest.mark.asyncio
async def test_calculator_tool_valid():
    tool = CalculatorTool()
    res = await tool.execute(expression="150 * 2 + 25")
    assert res["result"] == 325

@pytest.mark.asyncio
async def test_calculator_tool_sqrt():
    tool = CalculatorTool()
    res = await tool.execute(expression="sqrt(144) + 8")
    assert res["result"] == 20.0

@pytest.mark.asyncio
async def test_calculator_tool_invalid():
    tool = CalculatorTool()
    with pytest.raises(ValueError):
        await tool.execute(expression="__import__('os').system('ls')")

@pytest.mark.asyncio
async def test_python_sandbox_tool():
    tool = PythonSandboxTool()
    code = "data = [1, 2, 3, 4, 5]\nresult = sum(data) * 10"
    res = await tool.execute(code=code)
    assert res == 150

def test_tool_registry():
    tools = tool_registry.list_tools()
    names = [t["name"] for t in tools]
    assert "calculator" in names
    assert "http_request" in names
    assert "python_interpreter" in names

