from typing import Dict, Any
from app.workflow.nodes.base import BaseNodeExecutor, ExecutionContext

class ConditionalNodeExecutor(BaseNodeExecutor):
    async def execute(
        self,
        node_id: str,
        inputs: Dict[str, Any],
        config: Dict[str, Any],
        context: ExecutionContext,
    ) -> Dict[str, Any]:
        field = config.get("field", "input")
        operator = config.get("operator", "contains")
        target_val = str(config.get("value", "")).strip()

        # Find value to inspect
        val = inputs.get(field)
        if val is None and inputs:
            val = next(iter(inputs.values()))
        val_str = str(val or "")

        result_bool = False
        if operator == "contains":
            result_bool = target_val.lower() in val_str.lower()
        elif operator == "equals":
            result_bool = val_str.strip().lower() == target_val.lower()
        elif operator == "greater_than":
            try:
                result_bool = float(val_str) > float(target_val)
            except ValueError:
                result_bool = False
        elif operator == "less_than":
            try:
                result_bool = float(val_str) < float(target_val)
            except ValueError:
                result_bool = False
        elif operator == "is_empty":
            result_bool = len(val_str.strip()) == 0

        active_branch = "true_branch" if result_bool else "false_branch"
        context.log(
            "INFO",
            f"Evaluated condition '{field} {operator} {target_val}' => {result_bool}. Selected branch: {active_branch}",
            node_id,
        )

        return {
            "branch": active_branch,
            "is_true": result_bool,
            "value": val,
            "true_branch": val if result_bool else None,
            "false_branch": val if not result_bool else None,
        }
