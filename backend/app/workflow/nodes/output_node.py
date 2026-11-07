from typing import Dict, Any
from app.workflow.nodes.base import BaseNodeExecutor, ExecutionContext

class OutputNodeExecutor(BaseNodeExecutor):
    async def execute(
        self,
        node_id: str,
        inputs: Dict[str, Any],
        config: Dict[str, Any],
        context: ExecutionContext,
    ) -> Dict[str, Any]:
        resp_key = config.get("responseKey", "result")
        format_type = config.get("outputFormat", "markdown")

        # Gather incoming value from 'input' handle or first available input
        val = inputs.get("input")
        if val is None and inputs:
            val = next(iter(inputs.values()))

        context.log("INFO", f"Output node captured result under key '{resp_key}' (format: {format_type})", node_id)

        return {
            resp_key: val,
            "final_output": val,
        }

