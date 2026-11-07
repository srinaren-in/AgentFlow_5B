from sqlalchemy import Column, String, DateTime, JSON, Text, Float
from datetime import datetime, timezone
from app.database.base import Base

def utc_now():
    return datetime.now(timezone.utc)

class ExecutionModel(Base):
    __tablename__ = "executions"

    id = Column(String(64), primary_key=True, index=True)
    workflow_id = Column(String(64), nullable=False, index=True)
    status = Column(String(32), default="pending", index=True)  # pending, running, completed, failed
    inputs = Column(JSON, default=dict)
    result = Column(JSON, default=dict)
    node_states = Column(JSON, default=dict)
    logs = Column(JSON, default=list)
    error = Column(Text, nullable=True)
    start_time = Column(DateTime, default=utc_now)
    end_time = Column(DateTime, nullable=True)
    duration_ms = Column(Float, nullable=True)
