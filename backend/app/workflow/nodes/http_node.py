import httpx
import json
from typing import Dict, Any
from app.workflow.nodes.base import BaseNodeExecutor, ExecutionContext

class HTTPRequestNodeExecutor(BaseNodeExecutor):
    async def execute(
        self,
        node_id: str,
        inputs: Dict[str, Any],
        config: Dict[str, Any],
        context: ExecutionContext,
    ) -> Dict[str, Any]:
        method = config.get("method", "GET").upper()
        url = config.get("url", "")
        headers_raw = config.get("headers", "{}")
        body_template = config.get("bodyTemplate", "")

        if not url:
            raise ValueError(f"HTTP Node '{node_id}' missing URL.")

        try:
            headers = json.loads(headers_raw) if headers_raw.strip() else {}
        except Exception:
            headers = {}

        # Prepare request payload
        json_body = None
        if method in ["POST", "PUT", "PATCH"]:
            if body_template.strip():
                # Replace {{key}} placeholders
                rendered = body_template
                for k, v in inputs.items():
                    rendered = rendered.replace(f"{{{{{k}}}}}", str(v))
                try:
                    json_body = json.loads(rendered)
                except Exception:
                    json_body = {"data": rendered}
            elif inputs:
                json_body = inputs

        context.log("INFO", f"Dispatching HTTP {method} to {url}", node_id)

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.request(method=method, url=url, headers=headers, json=json_body)
            context.log("INFO", f"HTTP response status: {resp.status_code}", node_id)

            try:
                data = resp.json()
            except Exception:
                data = resp.text

            return {
                "response": data,
                "status_code": resp.status_code,
            }

