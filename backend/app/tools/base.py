from abc import ABC, abstractmethod
from typing import Dict, Any, Type, Optional
from pydantic import BaseModel

class BaseTool(ABC):
    name: str
    description: str
    args_schema: Optional[Type[BaseModel]] = None

    @abstractmethod
    async def execute(self, **kwargs) -> Any:
        """Executes the tool with validated arguments."""
        pass

    def to_function_declaration(self) -> Dict[str, Any]:
        """Converts tool definition to standard OpenAPI/Gemini function declaration schema."""
        properties = {}
        required = []

        if self.args_schema:
            schema = self.args_schema.model_json_schema()
            properties = schema.get("properties", {})
            required = schema.get("required", [])

        return {
            "name": self.name,
            "description": self.description,
            "parameters": {
                "type": "object",
                "properties": properties,
                "required": required,
            },
        }
