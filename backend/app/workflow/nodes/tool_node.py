import asyncio
import json
from typing import Dict, Any
from app.workflow.nodes.base import BaseNodeExecutor, ExecutionContext
from app.tools.python_sandbox import PythonSandboxTool

class PythonToolNodeExecutor(BaseNodeExecutor):
    def __init__(self):
        self.sandbox = PythonSandboxTool()

    async def execute(
        self,
        node_id: str,
        inputs: Dict[str, Any],
        config: Dict[str, Any],
        context: ExecutionContext,
    ) -> Dict[str, Any]:
        code = config.get("code", "")
        fn_name = config.get("functionName")

        context.log("INFO", f"Executing isolated Subprocess Python Sandbox", node_id)

        # Inject predecessor node inputs into subprocess execution scope
        input_injection = []
        if inputs:
            input_injection.append(f"inputs = {json.dumps(inputs)}")
            for k, v in inputs.items():
                if str(k).isidentifier():
                    input_injection.append(f"{k} = {json.dumps(v)}")

        injected_code = "\n".join(input_injection) + "\n" + code

        # If user defined a function name but didn't call it, invoke it automatically
        if fn_name and f"{fn_name}(" not in code and f"def {fn_name}" in code:
            injected_code += f"\nresult = {fn_name}(inputs)\n"

        result = await self.sandbox.execute(code=injected_code)
        context.log("INFO", "Python sandbox executed successfully in isolated subprocess", node_id)
        return {
            "result": result,
            "output": result,
        }
