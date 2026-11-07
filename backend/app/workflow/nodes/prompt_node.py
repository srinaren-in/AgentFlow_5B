from typing import Dict, Any
import re
from app.workflow.nodes.base import BaseNodeExecutor, ExecutionContext

class PromptTemplateNodeExecutor(BaseNodeExecutor):
    async def execute(
        self,
        node_id: str,
        inputs: Dict[str, Any],
        config: Dict[str, Any],
        context: ExecutionContext,
    ) -> Dict[str, Any]:
        template = config.get("template", "{input}")
        
        # Merge node-level inputs and execution-level inputs
        merged_vars = {**context.inputs, **inputs}

        # Also map handle names like 'var_query' -> 'query'
        for k, v in list(inputs.items()):
            if k.startswith("var_"):
                merged_vars[k[4:]] = v

        def replace_var(match):
            var_name = match.group(1)
            val = merged_vars.get(var_name)
            if val is None:
                context.log("WARN", f"Variable '{{{var_name}}}' not found in inputs, leaving empty.", node_id)
                return ""
            return str(val)

        formatted = re.sub(r"\{([a-zA-Z0-9_]+)\}", replace_var, template)
        context.log("INFO", f"Rendered prompt template ({len(formatted)} chars)", node_id)

        return {
            "formatted_prompt": formatted,
            "prompt": formatted,
        }
