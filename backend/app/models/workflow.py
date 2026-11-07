from sqlalchemy import Column, String, DateTime, JSON, Text
from datetime import datetime, timezone
from app.database.base import Base

def utc_now():
    return datetime.now(timezone.utc)

class WorkflowModel(Base):
    __tablename__ = "workflows"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    status = Column(String(32), default="draft")
    project_id = Column(String(64), nullable=True, index=True)
    tags = Column(JSON, default=list)
    flow_data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)
