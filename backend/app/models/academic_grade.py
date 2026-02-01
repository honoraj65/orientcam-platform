"""
Academic grade model
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, CheckConstraint, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class AcademicGrade(Base):
    """Student academic grades"""

    __tablename__ = "academic_grades"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    subject = Column(String(100), nullable=False)
    grade = Column(Integer, nullable=False)
    coefficient = Column(Integer, nullable=False, default=1)
    academic_year = Column(String(9), nullable=False)
    term = Column(String(20), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Constraints
    __table_args__ = (
        CheckConstraint("grade >= 0 AND grade <= 20", name="check_grade"),
        CheckConstraint("coefficient >= 1 AND coefficient <= 10", name="check_coefficient"),
    )

    # Relationships
    student = relationship("StudentProfile", back_populates="academic_grades")
