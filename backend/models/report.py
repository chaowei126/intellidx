import uuid
from sqlalchemy import Column, String, DateTime, Enum, Text, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from datetime import datetime, timezone
from sqlalchemy.orm import relationship
from core.database import Base
from models.user import User

class Report(Base):
    __tablename__ = "reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    title = Column(String(500), nullable=False)
    topic = Column(Text, nullable=False)
    industry = Column(String(100), nullable=True)
    depth = Column(Enum('quick', 'standard', 'deep', name='depth_enum'), nullable=False, default='standard')
    language = Column(String(10), nullable=False, default='ja') # 'en', 'zh', 'ja'
    model_name = Column(String(50), nullable=False, default='gemini-1.5-flash')
    status = Column(Enum('pending', 'processing', 'running', 'done', 'failed', name='status_enum'), nullable=False, default='pending')
    agent_log = Column(JSONB, nullable=True)
    content = Column(Text, nullable=True)
    docx_url = Column(Text, nullable=True)
    pdf_url = Column(Text, nullable=True)
    audio_url = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    citations = relationship("Citation", back_populates="report")
    user = relationship("User")

class Citation(Base):
    __tablename__ = "citations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id = Column(UUID(as_uuid=True), ForeignKey('reports.id'), nullable=False)
    url = Column(Text, nullable=False)
    title = Column(String(500), nullable=True)
    snippet = Column(Text, nullable=True)
    fetched_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    reliability_score = Column(Float, nullable=True)

    report = relationship("Report", back_populates="citations")
