from typing import Dict, Any
from app.workflow.nodes.base import BaseNodeExecutor, ExecutionContext

class InputNodeExecutor(BaseNodeExecutor):
    async def execute(
        self,
        node_id: str,
        inputs: Dict[str, Any],
        config: Dict[str, Any],
        context: ExecutionContext,
    ) -> Dict[str, Any]:
        var_name = config.get("variableName", "user_input")
        default_val = config.get("defaultValue", "")

        # Look in context runtime inputs first, then fallback to config default
        val = context.inputs.get(var_name, default_val)
        context.log("INFO", f"Input node received value for variable '{var_name}'", node_id)

        return {
            "output": val,
            var_name: val,
        }
