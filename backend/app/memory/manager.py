from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.memory import MemorySessionModel

class PersistentMemoryManager:
    @staticmethod
    def get_messages(session_id: str) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            session = db.query(MemorySessionModel).filter(MemorySessionModel.session_id == session_id).first()
            if not session or not session.messages:
                return []
            return session.messages

    @staticmethod
    def append_message(
        session_id: str,
        role: str,
        content: str,
        workflow_id: Optional[str] = None,
        tool_call_id: Optional[str] = None,
        max_history: int = 20,
    ) -> List[Dict[str, Any]]:
        with SessionLocal() as db:
            session = db.query(MemorySessionModel).filter(MemorySessionModel.session_id == session_id).first()
            if not session:
                session = MemorySessionModel(
                    session_id=session_id,
                    workflow_id=workflow_id,
                    messages=[],
                    context_data={},
                )
                db.add(session)

            messages = list(session.messages or [])
            new_msg = {
                "role": role,
                "content": content,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
            if tool_call_id:
                new_msg["tool_call_id"] = tool_call_id

            messages.append(new_msg)

            # Keep sliding window
            if len(messages) > max_history:
                messages = messages[-max_history:]

            session.messages = messages
            session.updated_at = datetime.now(timezone.utc)
            db.commit()
            return messages

    @staticmethod
    def clear_session(session_id: str) -> bool:
        with SessionLocal() as db:
            session = db.query(MemorySessionModel).filter(MemorySessionModel.session_id == session_id).first()
            if session:
                db.delete(session)
                db.commit()
                return True
            return False

memory_manager = PersistentMemoryManager()

