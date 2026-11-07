import httpx
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from app.tools.base import BaseTool
from app.core.ssrf import validate_outbound_url

class HTTPRequestInput(BaseModel):
    url: str = Field(..., description="The HTTP or HTTPS URL to fetch or query")
    method: str = Field(default="GET", description="HTTP method: GET, POST")
    params: Optional[Dict[str, Any]] = Field(default=None, description="Query parameters")
    json_data: Optional[Dict[str, Any]] = Field(default=None, description="JSON body payload for POST requests")

class HTTPRequestTool(BaseTool):
    name = "http_request"
    description = "Useful for fetching live web content, querying public APIs, or reading remote JSON data."
    args_schema = HTTPRequestInput

    async def execute(self, url: str, method: str = "GET", params: Dict[str, Any] = None, json_data: Dict[str, Any] = None, **kwargs) -> Any:
        # SSRF validation check
        validate_outbound_url(url, allow_localhost=False)

        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            resp = await client.request(
                method=method.upper(),
                url=url,
                params=params,
                json=json_data,
                headers={"User-Agent": "AgentFlow-Agent/0.1.0"},
            )
            
            try:
                data = resp.json()
            except Exception:
                data = resp.text[:4000]

            return {
                "status_code": resp.status_code,
                "url": url,
                "data": data,
            }
