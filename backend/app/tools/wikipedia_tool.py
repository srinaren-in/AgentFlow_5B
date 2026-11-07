import httpx
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from app.tools.base import BaseTool

class WikipediaSearchInput(BaseModel):
    query: str = Field(..., description="The search query or entity name to look up on Wikipedia.")
    limit: Optional[int] = Field(3, description="Maximum number of search results to return (1-5).")

class WikipediaSearchTool(BaseTool):
    name = "wikipedia_search"
    description = (
        "Search Wikipedia for factual background information, encyclopedic concepts, scientific topics, "
        "historical events, or entity summaries. Returns relevant excerpts and article summaries."
    )
    args_schema = WikipediaSearchInput

    async def execute(self, query: str, limit: int = 3, **kwargs) -> Dict[str, Any]:
        """
        Execute Wikipedia search via Wikipedia public API with fallback.
        """
        clean_limit = max(1, min(limit or 3, 5))
        url = "https://en.wikipedia.org/w/api.php"
        params = {
            "action": "query",
            "list": "search",
            "srsearch": query,
            "utf8": 1,
            "format": "json",
            "srlimit": clean_limit,
        }
        headers = {
            "User-Agent": "AgentFlow-Research/1.0 (academic tool integration; educational agent framework)"
        }

        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.get(url, params=params, headers=headers)
                if resp.status_code != 200:
                    return {"query": query, "error": f"Wikipedia API responded with status {resp.status_code}", "results": []}

                data = resp.json()
                search_hits = data.get("query", {}).get("search", [])
                if not search_hits:
                    return {"query": query, "results": [], "message": "No matching Wikipedia articles found."}

                results = []
                for hit in search_hits:
                    title = hit.get("title", "")
                    snippet = hit.get("snippet", "").replace('<span class="searchmatch">', "").replace("</span>", "")
                    results.append({
                        "title": title,
                        "snippet": snippet,
                        "page_id": hit.get("pageid"),
                    })

                return {
                    "query": query,
                    "total_hits": len(results),
                    "results": results,
                }
        except Exception as e:
            return {"query": query, "error": f"Failed to retrieve Wikipedia information: {str(e)}", "results": []}
