import httpx
from typing import Dict, Any
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
        url = f"{self.base_url}/api/generate"
        payload = {
            "model": model,
            "prompt": prompt,
            "system": system_prompt,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
            },
        }

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code != 200:
                    raise RuntimeError(f"Ollama returned status {resp.status_code}: {resp.text}")
                data = resp.json()
                return data.get("response", "")
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
                    return {"status": "available", "models": models}
                return {"status": "error", "message": f"HTTP {resp.status_code}"}
        except Exception as e:
            return {"status": "offline", "message": f"Ollama not running: {str(e)}"}
