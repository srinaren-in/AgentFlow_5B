from fastapi import APIRouter
from typing import List, Dict, Any
from app.tools.registry import tool_registry

router = APIRouter()

@router.get("", response_model=List[Dict[str, Any]])
def list_available_tools():
    return tool_registry.list_tools()

