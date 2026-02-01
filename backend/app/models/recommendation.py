"""
Recommendation model
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, JSON, CheckConstraint, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Recommendation(Base):
    """Program recommendation for student"""

    __tablename__ = "recommendations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    program_id = Column(String(36), ForeignKey("programs.id", ondelete="CASCADE"), nullable=False, index=True)

    # Scores
    total_score = Column(Integer, nullable=False)
    ranking = Column(Integer, nullable=False)
    riasec_score = Column(Integer, nullable=False)
    grades_score = Column(Integer, nullable=False)
    values_score = Column(Integer, nullable=False)
    employment_score = Column(Integer, nullable=False)
    financial_score = Column(Integer, nullable=False)

    # Explanations
    strengths = Column(JSON)
    weaknesses = Column(JSON)
    advice = Column(Text)

    algorithm_version = Column(String(10), nullable=False, default="1.0")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Constraints
    __table_args__ = (
        CheckConstraint("total_score >= 0 AND total_score <= 100", name="check_total_score"),
    )

    # Relationships
    student = relationship("StudentProfile", back_populates="recommendations")
    program = relationship("Program", back_populates="recommendations")
