"""
Student profile model
"""
import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Integer, Date, DateTime, Text, CheckConstraint, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class StudentProfile(Base):
    """Student profile with personal and academic information"""

    __tablename__ = "student_profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)

    # User type: 'new_bachelor' or 'university_student'
    user_type = Column(String(20), default='new_bachelor')

    # University information (for university_student type)
    university_establishment = Column(String(50))  # e.g., "FS", "FSEG", "FSJP"
    university_department = Column(String(100))  # e.g., "INFORMATIQUE", "BANQUE_FINANCE_ASSURANCES"
    university_level = Column(String(50))  # e.g., "Licence 1", "Licence 2", "Master 1"

    # Personal info
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20))
    gender = Column(String(10))
    date_of_birth = Column(Date)
    city = Column(String(100))
    region = Column(String(100))

    # Academic background
    current_education_level = Column(String(50))
    bac_series = Column(String(20))
    bac_year = Column(Integer)
    bac_grade = Column(Integer)

    # Financial info
    max_annual_budget = Column(Integer)  # Deprecated: use financial_situation instead
    financial_situation = Column(String(50))  # "Très faible", "Faible", "Moyen", "Bon", "Très bon"
    financial_aid_eligible = Column(Integer, default=0)

    # Profile completion
    completion_percentage = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Constraints
    __table_args__ = (
        CheckConstraint("gender IN ('M', 'F', 'Autre')", name="check_gender"),
        CheckConstraint("bac_grade >= 0 AND bac_grade <= 20", name="check_bac_grade"),
        CheckConstraint("completion_percentage >= 0 AND completion_percentage <= 100", name="check_completion"),
    )

    # Relationships
    user = relationship("User", back_populates="student_profile")
    riasec_tests = relationship("RiasecTest", back_populates="student", cascade="all, delete-orphan")
    riasec_draft = relationship("RiasecTestDraft", back_populates="student", cascade="all, delete-orphan", uselist=False)
    academic_grades = relationship("AcademicGrade", back_populates="student", cascade="all, delete-orphan")
    professional_values = relationship("ProfessionalValue", back_populates="student", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="student", cascade="all, delete-orphan")
    favorites = relationship("StudentFavorite", back_populates="student", cascade="all, delete-orphan")
