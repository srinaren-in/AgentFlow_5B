from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from datetime import datetime, timezone
from app.database.base import Base

def utc_now():
    return datetime.now(timezone.utc)

class ProjectModel(Base):
    __tablename__ = "projects"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    color = Column(String(32), default="#4f46e5")
    user_id = Column(String(64), nullable=True, index=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

