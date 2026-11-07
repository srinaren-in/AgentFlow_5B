from fastapi import APIRouter
from typing import List, Dict, Any
from app.memory.manager import memory_manager

router = APIRouter()

@router.get("/{session_id}", response_model=List[Dict[str, Any]])
def get_session_history(session_id: str):
    return memory_manager.get_messages(session_id)

@router.post("/{session_id}/clear")
def clear_session_history(session_id: str):
    success = memory_manager.clear_session(session_id)
    return {"session_id": session_id, "cleared": success}
