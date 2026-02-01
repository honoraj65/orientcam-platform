"""
Testimonial model
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, Boolean, CheckConstraint, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Testimonial(Base):
    """Student testimonials for programs"""

    __tablename__ = "testimonials"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    program_id = Column(String(36), ForeignKey("programs.id", ondelete="CASCADE"), nullable=False, index=True)
    student_name = Column(String(200), nullable=False)
    graduation_year = Column(Integer, nullable=False)
    current_position = Column(String(200))
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Constraints
    __table_args__ = (
        CheckConstraint("rating >= 1 AND rating <= 5", name="check_rating"),
    )

    # Relationships
    program = relationship("Program", back_populates="testimonials")
