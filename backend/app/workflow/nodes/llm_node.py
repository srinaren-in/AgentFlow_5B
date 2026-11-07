from typing import Dict, Any
from app.workflow.nodes.base import BaseNodeExecutor, ExecutionContext
from app.providers.ollama_provider import OllamaProvider
from app.providers.gemini_provider import GeminiProvider

class LLMNodeExecutor(BaseNodeExecutor):
    def __init__(self):
        self.ollama = OllamaProvider()
        self.gemini = GeminiProvider()

    async def execute(
        self,
        node_id: str,
        inputs: Dict[str, Any],
        config: Dict[str, Any],
        context: ExecutionContext,
    ) -> Dict[str, Any]:
        provider_name = config.get("provider", "ollama").lower()
        model = config.get("model", "qwen2.5:7b" if provider_name == "ollama" else "gemini-2.0-flash")
        temperature = float(config.get("temperature", 0.7))
        max_tokens = int(config.get("maxTokens", 2048))
        system_prompt = config.get("systemPrompt", "")

        # Prompt can come from 'prompt', 'formatted_prompt', or general inputs
        prompt = inputs.get("prompt") or inputs.get("formatted_prompt")
        if not prompt and inputs:
            prompt = str(next(iter(inputs.values())))

        if not prompt:
            raise ValueError(f"LLM Node '{node_id}' received empty prompt input.")

        # System prompt override from handle if connected
        if inputs.get("system_prompt"):
            system_prompt = str(inputs.get("system_prompt"))

        context.log("INFO", f"Calling {provider_name.upper()} model '{model}' (temp: {temperature})", node_id)

        if provider_name == "gemini":
            response_text = await self.gemini.generate(
                prompt=prompt,
                system_prompt=system_prompt,
                model=model,
                temperature=temperature,
                max_tokens=max_tokens,
            )
        else:
            response_text = await self.ollama.generate(
                prompt=prompt,
                system_prompt=system_prompt,
                model=model,
                temperature=temperature,
                max_tokens=max_tokens,
            )

        context.log("INFO", f"Received response from {provider_name.upper()} ({len(response_text)} chars)", node_id)

        return {
            "response": response_text,
            "output": response_text,
        }
