from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from .workflow import WorkflowDefinitionSchema

class ExecutionRequest(BaseModel):
    workflow_id: Optional[str] = None
    workflow: Optional[WorkflowDefinitionSchema] = None
    inputs: Dict[str, Any] = Field(default_factory=dict)
    timeout_seconds: Optional[int] = None

class NodeExecutionState(BaseModel):
    node_id: str
    node_type: str
    status: str = "pending"  # pending, running, completed, failed, skipped
    inputs: Dict[str, Any] = Field(default_factory=dict)
    outputs: Dict[str, Any] = Field(default_factory=dict)
    error: Optional[str] = None
    duration_ms: Optional[float] = None

class ExecutionLogEntry(BaseModel):
    timestamp: str
    level: str  # INFO, WARN, ERROR, DEBUG
    message: str
    node_id: Optional[str] = None

class ExecutionResponse(BaseModel):
    execution_id: str
    workflow_id: str
    status: str  # pending, running, completed, failed
    result: Dict[str, Any] = Field(default_factory=dict)
    node_states: Dict[str, NodeExecutionState] = Field(default_factory=dict)
    logs: List[ExecutionLogEntry] = Field(default_factory=list)
    error: Optional[str] = None
    start_time: str
    end_time: Optional[str] = None
    duration_ms: Optional[float] = None
