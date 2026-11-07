from typing import Dict
from .base import BaseNodeExecutor
from .input_node import InputNodeExecutor
from .output_node import OutputNodeExecutor
from .prompt_node import PromptTemplateNodeExecutor
from .llm_node import LLMNodeExecutor
from .conditional_node import ConditionalNodeExecutor
from .tool_node import PythonToolNodeExecutor
from .http_node import HTTPRequestNodeExecutor
from .memory_node import MemoryNodeExecutor
from .agent_node import AgentNodeExecutor

NODE_EXECUTORS: Dict[str, BaseNodeExecutor] = {
    "inputNode": InputNodeExecutor(),
    "outputNode": OutputNodeExecutor(),
    "promptTemplateNode": PromptTemplateNodeExecutor(),
    "llmNode": LLMNodeExecutor(),
    "conditionalNode": ConditionalNodeExecutor(),
    "pythonToolNode": PythonToolNodeExecutor(),
    "httpRequestNode": HTTPRequestNodeExecutor(),
    "memoryNode": MemoryNodeExecutor(),
    "agentNode": AgentNodeExecutor(),
}
