import httpx
from typing import Dict, Any, List, Optional
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
        model: str = "gemini-2.0-flash",
        temperature: float = 0.7,
        max_tokens: int = 2048,
        tools: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
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

        # If tools provided, format for Gemini: {"tools": [{"function_declarations": [...]}]}
        if tools:
            payload["tools"] = [{"function_declarations": tools}]

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code != 200:
                    raise RuntimeError(f"Gemini API returned HTTP {resp.status_code}: {resp.text}")

                data = resp.json()
                candidates = data.get("candidates", [])
                if not candidates:
                    raise RuntimeError(f"No response candidate returned from Gemini: {data}")

                parts = candidates[0].get("content", {}).get("parts", [])
                content_text = ""
                tool_calls = []

                for part in parts:
                    if "text" in part:
                        content_text += part["text"]
                    elif "functionCall" in part:
                        fn_call = part["functionCall"]
                        tool_calls.append({
                            "name": fn_call.get("name"),
                            "args": fn_call.get("args", {}),
                        })

                return {
                    "content": content_text,
                    "tool_calls": tool_calls,
                }
        except Exception as e:
            raise RuntimeError(f"Gemini provider error: {str(e)}")

    async def check_health(self) -> Dict[str, Any]:
        if not self.api_key:
            return {
                "status": "unconfigured",
                "message": "No GEMINI_API_KEY found in backend/.env",
                "supported_models": ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
            }

        url = f"https://generativelanguage.googleapis.com/v1beta/models?key={self.api_key}"
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    models = [
                        m.get("name", "").replace("models/", "")
                        for m in resp.json().get("models", [])
                        if "gemini" in m.get("name", "")
                    ]
                    return {
                        "status": "available",
                        "models": models[:6],
                        "default_model": "gemini-2.0-flash",
                    }
                return {"status": "error", "message": f"HTTP {resp.status_code}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
