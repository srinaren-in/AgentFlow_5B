import httpx
from typing import Dict, Any, List, Optional
from app.providers.base import BaseLLMProvider
from app.core.config import settings

class OllamaProvider(BaseLLMProvider):
    def __init__(self, base_url: str = None):
        self.base_url = (base_url or settings.OLLAMA_BASE_URL).rstrip("/")

    async def generate(
        self,
        prompt: str,
        system_prompt: str = "",
        model: str = "qwen2.5:7b",
        temperature: float = 0.7,
        max_tokens: int = 2048,
    ) -> str:
        res = await self.generate_response(
            prompt=prompt,
            system_prompt=system_prompt,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return res.get("content", "")

    async def generate_response(
        self,
        prompt: str,
        system_prompt: str = "",
        model: str = "qwen2.5:7b",
        temperature: float = 0.7,
        max_tokens: int = 2048,
        tools: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        url = f"{self.base_url}/api/chat"
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
            },
        }

        # If tools provided, pass tool declarations
        if tools:
            payload["tools"] = tools

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code != 200:
                    raise RuntimeError(f"Ollama returned HTTP {resp.status_code}: {resp.text}")

                data = resp.json()
                msg = data.get("message", {})
                content = msg.get("content", "")
                tool_calls_raw = msg.get("tool_calls", [])

                formatted_tool_calls = []
                for tc in tool_calls_raw:
                    fn = tc.get("function", {})
                    formatted_tool_calls.append({
                        "name": fn.get("name"),
                        "args": fn.get("arguments", {}),
                    })

                return {
                    "content": content,
                    "tool_calls": formatted_tool_calls,
                }
        except httpx.ConnectError:
            raise RuntimeError(
                f"Cannot connect to Ollama at {self.base_url}. Ensure Ollama is running (`ollama serve`)."
            )
        except Exception as e:
            raise RuntimeError(f"Ollama execution error: {str(e)}")

    async def check_health(self) -> Dict[str, Any]:
        url = f"{self.base_url}/api/tags"
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    models = [m.get("name") for m in resp.json().get("models", [])]
                    return {
                        "status": "available",
                        "endpoint": self.base_url,
                        "models": models if models else ["qwen2.5:7b (Not downloaded)"],
                        "default_model": "qwen2.5:7b",
                    }
                return {"status": "error", "message": f"HTTP {resp.status_code}"}
        except Exception as e:
            return {"status": "offline", "endpoint": self.base_url, "message": f"Ollama offline: {str(e)}"}
