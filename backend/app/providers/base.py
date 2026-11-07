from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional

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
        """Generates raw text completion."""
        pass

    @abstractmethod
    async def generate_response(
        self,
        prompt: str,
        system_prompt: str = "",
        model: str = "",
        temperature: float = 0.7,
        max_tokens: int = 2048,
        tools: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """
        Generates completion and optionally returns structured tool calls:
        Returns: {
            "content": str,
            "tool_calls": List[{"name": str, "args": dict}]
        }
        """
        pass

    @abstractmethod
    async def check_health(self) -> Dict[str, Any]:
        """Checks connectivity and returns status."""
        pass
