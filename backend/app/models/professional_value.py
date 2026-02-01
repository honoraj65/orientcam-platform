"""
Professional values model
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, CheckConstraint, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class ProfessionalValue(Base):
    """Student professional values assessment"""

    __tablename__ = "professional_values"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False, unique=True)

    # Values (scored 1-5)
    autonomy = Column(Integer, nullable=False)
    creativity = Column(Integer, nullable=False)
    helping_others = Column(Integer, nullable=False)
    job_security = Column(Integer, nullable=False)
    salary = Column(Integer, nullable=False)
    work_life_balance = Column(Integer, nullable=False)
    prestige = Column(Integer, nullable=False)
    variety = Column(Integer, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Constraints
    __table_args__ = (
        CheckConstraint("autonomy >= 1 AND autonomy <= 5", name="check_autonomy"),
        CheckConstraint("creativity >= 1 AND creativity <= 5", name="check_creativity"),
        CheckConstraint("helping_others >= 1 AND helping_others <= 5", name="check_helping_others"),
        CheckConstraint("job_security >= 1 AND job_security <= 5", name="check_job_security"),
        CheckConstraint("salary >= 1 AND salary <= 5", name="check_salary"),
        CheckConstraint("work_life_balance >= 1 AND work_life_balance <= 5", name="check_work_life_balance"),
        CheckConstraint("prestige >= 1 AND prestige <= 5", name="check_prestige"),
        CheckConstraint("variety >= 1 AND variety <= 5", name="check_variety"),
    )

    # Relationships
    student = relationship("StudentProfile", back_populates="professional_values")
