from fastapi import APIRouter
from typing import Dict, Any
from app.providers.ollama_provider import OllamaProvider
from app.providers.gemini_provider import GeminiProvider

router = APIRouter()

ollama = OllamaProvider()
gemini = GeminiProvider()

@router.get("/status")
async def get_providers_status() -> Dict[str, Any]:
    ollama_health = await ollama.check_health()
    gemini_health = await gemini.check_health()

    return {
        "ollama": {
            "name": "Ollama (Local LLM)",
            "type": "local",
            "endpoint": ollama.base_url,
            **ollama_health,
        },
        "gemini": {
            "name": "Google Gemini (Cloud AI)",
            "type": "cloud",
            **gemini_health,
        },
    }

