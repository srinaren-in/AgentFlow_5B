from typing import List, Dict, Any, Optional, TypedDict

class IntermediateStep(TypedDict):
    step: int
    action: str
    args: Dict[str, Any]
    observation: Any
    duration_ms: Optional[float]

class AgentState(TypedDict):
    goal: str
    system_instructions: str
    messages: List[Dict[str, Any]]
    current_step: int
    max_steps: int
    tool_names: List[str]
    tool_calls: List[Dict[str, Any]]
    intermediate_steps: List[IntermediateStep]
    final_output: Optional[str]
    status: str  # running, completed, failed
    logs: List[Dict[str, Any]]
    provider_name: str
    model_name: str

