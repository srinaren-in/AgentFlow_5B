from typing import Dict, List, Optional, Any
from app.tools.base import BaseTool
from app.tools.calculator import CalculatorTool
from app.tools.http_tool import HTTPRequestTool
from app.tools.python_sandbox import PythonSandboxTool

class ToolRegistry:
    def __init__(self):
        self._tools: Dict[str, BaseTool] = {}
        # Register core built-in tools
        self.register(CalculatorTool())
        self.register(HTTPRequestTool())
        self.register(PythonSandboxTool())

    def register(self, tool: BaseTool):
        self._tools[tool.name] = tool

    def get_tool(self, name: str) -> Optional[BaseTool]:
        return self._tools.get(name)

    def list_tools(self) -> List[Dict[str, Any]]:
        return [
            {
                "name": t.name,
                "description": t.description,
                "schema": t.args_schema.model_json_schema() if t.args_schema else {},
            }
            for t in self._tools.values()
        ]

    def get_function_declarations(self, tool_names: List[str] = None) -> List[Dict[str, Any]]:
        selected = self._tools.values() if not tool_names else [
            self._tools[name] for name in tool_names if name in self._tools
        ]
        return [t.to_function_declaration() for t in selected]

tool_registry = ToolRegistry()

