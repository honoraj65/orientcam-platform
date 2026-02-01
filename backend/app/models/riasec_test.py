"""
RIASEC test models
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, JSON, CheckConstraint, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class RiasecDimension(Base):
    """RIASEC dimension reference data"""

    __tablename__ = "riasec_dimensions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(1), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    color = Column(String(7), nullable=False)

    # Relationships
    questions = relationship("RiasecQuestion", back_populates="dimension", cascade="all, delete-orphan")


class RiasecQuestion(Base):
    """RIASEC test questions"""

    __tablename__ = "riasec_questions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    dimension_id = Column(String(36), ForeignKey("riasec_dimensions.id", ondelete="CASCADE"), nullable=False)
    question_number = Column(Integer, nullable=False, unique=True)
    text = Column(Text, nullable=False)
    reverse_scored = Column(Integer, default=0, nullable=False)

    # Relationships
    dimension = relationship("RiasecDimension", back_populates="questions")


class RiasecTest(Base):
    """Student RIASEC test results"""

    __tablename__ = "riasec_tests"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False, index=True)

    # Scores
    realistic_score = Column(Integer, nullable=False)
    investigative_score = Column(Integer, nullable=False)
    artistic_score = Column(Integer, nullable=False)
    social_score = Column(Integer, nullable=False)
    enterprising_score = Column(Integer, nullable=False)
    conventional_score = Column(Integer, nullable=False)

    holland_code = Column(String(3), nullable=False)
    raw_answers = Column(JSON, nullable=False)
    test_version = Column(String(10), nullable=False, default="1.0")
    duration_seconds = Column(Integer)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Constraints
    __table_args__ = (
        CheckConstraint("realistic_score >= 0 AND realistic_score <= 100", name="check_realistic"),
        CheckConstraint("investigative_score >= 0 AND investigative_score <= 100", name="check_investigative"),
        CheckConstraint("artistic_score >= 0 AND artistic_score <= 100", name="check_artistic"),
        CheckConstraint("social_score >= 0 AND social_score <= 100", name="check_social"),
        CheckConstraint("enterprising_score >= 0 AND enterprising_score <= 100", name="check_enterprising"),
        CheckConstraint("conventional_score >= 0 AND conventional_score <= 100", name="check_conventional"),
    )

    # Relationships
    student = relationship("StudentProfile", back_populates="riasec_tests")


class RiasecTestDraft(Base):
    """Draft/in-progress RIASEC test (for saving progress)"""

    __tablename__ = "riasec_test_drafts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)

    # Draft data
    answers = Column(JSON, nullable=False, default=dict)  # {question_id: answer_value}
    current_question_index = Column(Integer, nullable=False, default=0)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    student = relationship("StudentProfile", back_populates="riasec_draft")
