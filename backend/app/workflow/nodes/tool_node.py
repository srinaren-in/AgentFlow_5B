import asyncio
from typing import Dict, Any
from app.workflow.nodes.base import BaseNodeExecutor, ExecutionContext

class PythonToolNodeExecutor(BaseNodeExecutor):
    async def execute(
        self,
        node_id: str,
        inputs: Dict[str, Any],
        config: Dict[str, Any],
        context: ExecutionContext,
    ) -> Dict[str, Any]:
        fn_name = config.get("functionName", "transform_data")
        code = config.get("code", "")
        timeout = int(config.get("timeoutSeconds", 10))

        context.log("INFO", f"Executing python transformation '{fn_name}'", node_id)

        # Restricted safe globals
        safe_globals = {
            "__builtins__": {
                "abs": abs,
                "all": all,
                "any": any,
                "bool": bool,
                "dict": dict,
                "enumerate": enumerate,
                "float": float,
                "int": int,
                "isinstance": isinstance,
                "len": len,
                "list": list,
                "max": max,
                "min": min,
                "round": round,
                "set": set,
                "str": str,
                "sum": sum,
                "tuple": tuple,
                "zip": zip,
            }
        }
        local_scope = {}

        def _run_script():
            exec(code, safe_globals, local_scope)
            if fn_name not in local_scope:
                raise ValueError(f"Function '{fn_name}' not defined in tool script.")
            return local_scope[fn_name](inputs)

        # Execute with timeout
        loop = asyncio.get_event_loop()
        result = await asyncio.wait_for(loop.run_in_executor(None, _run_script), timeout=timeout)

        context.log("INFO", f"Tool '{fn_name}' executed successfully", node_id)
        return {
            "result": result,
            "output": result,
        }
