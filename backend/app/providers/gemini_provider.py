import httpx
from typing import Dict, Any
from app.providers.base import BaseLLMProvider
from app.core.config import settings

class GeminiProvider(BaseLLMProvider):
    def __init__(self, api_key: str = None):
        self.api_key = api_key or settings.GEMINI_API_KEY

    async def generate(
        self,
        prompt: str,
        system_prompt: str = "",
        model: str = "gemini-2.0-flash",
        temperature: float = 0.7,
        max_tokens: int = 2048,
    ) -> str:
        if not self.api_key:
            raise ValueError(
                "Gemini API key is not configured. Add GEMINI_API_KEY to your backend/.env file."
            )

        clean_model = model.replace("models/", "")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{clean_model}:generateContent?key={self.api_key}"

        contents = []
        if system_prompt:
            contents.append({"role": "user", "parts": [{"text": f"System Instructions: {system_prompt}"}]})
            contents.append({"role": "model", "parts": [{"text": "Understood. I will strictly follow these instructions."}]})

        contents.append({"role": "user", "parts": [{"text": prompt}]})

        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens,
            },
        }

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code != 200:
                    raise RuntimeError(f"Gemini API returned HTTP {resp.status_code}: {resp.text}")
                data = resp.json()

                candidates = data.get("candidates", [])
                if not candidates:
                    raise RuntimeError(f"No response generated from Gemini API: {data}")

                parts = candidates[0].get("content", {}).get("parts", [])
                text_output = "".join([p.get("text", "") for p in parts])
                return text_output
        except Exception as e:
            raise RuntimeError(f"Gemini provider error: {str(e)}")

    async def check_health(self) -> Dict[str, Any]:
        if not self.api_key:
            return {"status": "unconfigured", "message": "No GEMINI_API_KEY present in backend environment."}
        return {"status": "configured", "message": "API Key is set."}
