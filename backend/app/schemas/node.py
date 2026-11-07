from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

class NodePosition(BaseModel):
    x: float = 0.0
    y: float = 0.0

class NodeData(BaseModel):
    label: str = "Node"
    nodeType: str
    description: Optional[str] = None
    isValid: Optional[bool] = True
    config: Dict[str, Any] = Field(default_factory=dict)

class NodeSchema(BaseModel):
    id: str
    type: str
    position: Optional[NodePosition] = Field(default_factory=NodePosition)
    data: NodeData
