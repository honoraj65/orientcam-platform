"""
Academic program models
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, Boolean, DateTime, CheckConstraint, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class Program(Base):
    """Academic program"""

    __tablename__ = "programs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(200), nullable=False)
    university = Column(String(100), nullable=True)
    level = Column(String(20), nullable=False)
    domain = Column(String(100), nullable=True, index=True)
    duration_years = Column(Integer, nullable=True)
    department = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    objectives = Column(Text)
    career_prospects = Column(Text)

    # Prerequisites
    required_bac_series = Column(JSON, nullable=False)
    min_bac_grade = Column(Integer)
    required_subjects = Column(JSON)

    # RIASEC match
    riasec_match = Column(String(3), nullable=False)

    # Costs
    registration_fee = Column(Integer, nullable=False)
    annual_tuition = Column(Integer, nullable=False)
    total_cost_3years = Column(Integer, nullable=False)

    # Employment
    employment_rate = Column(Integer)
    average_starting_salary = Column(Integer)

    # Capacity
    capacity = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Master program link (for Licence programs)
    master_program_id = Column(String(36), ForeignKey("programs.id"), nullable=True, index=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    subjects = relationship("ProgramSubject", back_populates="program", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="program", cascade="all, delete-orphan")
    favorites = relationship("StudentFavorite", back_populates="program", cascade="all, delete-orphan")
    testimonials = relationship("Testimonial", back_populates="program", cascade="all, delete-orphan")

    # Master program relationship (for Licence -> Master path)
    master_program = relationship("Program", remote_side=[id], foreign_keys=[master_program_id], uselist=False)
    licence_programs = relationship("Program", remote_side=[master_program_id], foreign_keys=[master_program_id])


class ProgramSubject(Base):
    """Program subjects"""

    __tablename__ = "program_subjects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    program_id = Column(String(36), ForeignKey("programs.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    credits = Column(Integer, nullable=False)
    semester = Column(Integer, nullable=False)
    is_mandatory = Column(Boolean, default=True, nullable=False)

    # Relationships
    program = relationship("Program", back_populates="subjects")
