from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseLLMProvider(ABC):
    @abstractmethod
    async def generate(
        self,
        prompt: str,
        system_prompt: str = "",
        model: str = "",
        temperature: float = 0.7,
        max_tokens: int = 2048,
    ) -> str:
        """Generates completion text from LLM provider."""
        pass

    @abstractmethod
    async def check_health(self) -> Dict[str, Any]:
        """Checks provider connectivity and availability."""
        pass
