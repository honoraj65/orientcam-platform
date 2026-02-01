"""
Student favorites model
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class StudentFavorite(Base):
    """Student saved favorite programs"""

    __tablename__ = "student_favorites"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    program_id = Column(String(36), ForeignKey("programs.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    student = relationship("StudentProfile", back_populates="favorites")
    program = relationship("Program", back_populates="favorites")
