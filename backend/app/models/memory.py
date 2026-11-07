from sqlalchemy import Column, String, DateTime, JSON, Text
from datetime import datetime, timezone
from app.database.base import Base

def utc_now():
    return datetime.now(timezone.utc)

class MemorySessionModel(Base):
    __tablename__ = "memory_sessions"

    session_id = Column(String(64), primary_key=True, index=True)
    workflow_id = Column(String(64), nullable=True, index=True)
    messages = Column(JSON, default=list)  # List of {"role": "user"|"assistant"|"tool", "content": "..."}
    context_data = Column(JSON, default=dict)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

