from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from .node import NodeSchema

class EdgeSchema(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None
    type: Optional[str] = "smoothstep"
    animated: Optional[bool] = True

class WorkflowMetadata(BaseModel):
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
    tags: Optional[List[str]] = Field(default_factory=list)
    projectId: Optional[str] = None

class WorkflowDefinitionSchema(BaseModel):
    id: str
    name: str = "Untitled Workflow"
    description: Optional[str] = ""
    version: Optional[str] = "1.0.0"
    status: Optional[str] = "draft"
    nodes: List[NodeSchema] = Field(default_factory=list)
    edges: List[EdgeSchema] = Field(default_factory=list)
    metadata: Optional[WorkflowMetadata] = Field(default_factory=WorkflowMetadata)

class WorkflowCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    projectId: Optional[str] = None
    tags: Optional[List[str]] = Field(default_factory=list)
    flowData: Optional[WorkflowDefinitionSchema] = None

class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    tags: Optional[List[str]] = None
    flowData: Optional[WorkflowDefinitionSchema] = None

class WorkflowValidationResponse(BaseModel):
    is_valid: bool
    errors: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    execution_order: List[str] = Field(default_factory=list)
    entry_nodes: List[str] = Field(default_factory=list)
    exit_nodes: List[str] = Field(default_factory=list)
