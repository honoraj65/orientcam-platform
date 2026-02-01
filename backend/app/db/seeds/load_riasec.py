"""
Seed loader for RIASEC questions
"""
import json
from pathlib import Path
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
import logging

# Import all models to initialize relationships properly
from app.models.user import User
from app.models.student_profile import StudentProfile
from app.models.riasec_test import RiasecTest, RiasecDimension, RiasecQuestion
from app.models.academic_grade import AcademicGrade
from app.models.professional_value import ProfessionalValue
from app.models.program import Program, ProgramSubject
from app.models.recommendation import Recommendation
from app.models.student_favorite import StudentFavorite
from app.models.testimonial import Testimonial
from app.models.notification import Notification
from app.models.activity_log import ActivityLog

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def load_riasec_questions(db: Session) -> None:
    """Load RIASEC questions from JSON file"""

    # Check if already loaded
    existing_count = db.query(RiasecQuestion).count()
    if existing_count > 0:
        logger.info(f"RIASEC questions already loaded ({existing_count} questions)")
        return

    # Load JSON file
    json_path = Path(__file__).parent / "riasec_questions.json"
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    logger.info(f"Loading RIASEC test version {data['version']}")

    # Insert dimensions
    dimensions_map = {}
    for dim_data in data["dimensions"]:
        dimension = RiasecDimension(
            code=dim_data["code"],
            name=dim_data["name"],
            description=dim_data["description"],
            color=dim_data["color"]
        )
        db.add(dimension)
        db.flush()
        dimensions_map[dim_data["code"]] = dimension.id
        logger.info(f"Created dimension: {dim_data['code']} - {dim_data['name']}")

    # Insert questions
    for q_data in data["questions"]:
        question = RiasecQuestion(
            dimension_id=dimensions_map[q_data["dimension"]],
            question_number=q_data["question_number"],
            text=q_data["text"],
            reverse_scored=1 if q_data.get("reverse_scored", False) else 0
        )
        db.add(question)

    db.commit()

    total_questions = db.query(RiasecQuestion).count()
    logger.info(f"Successfully loaded {total_questions} RIASEC questions")


def main():
    """Main entry point"""
    logger.info("Starting RIASEC seed loader...")

    db = SessionLocal()
    try:
        load_riasec_questions(db)
        logger.info("RIASEC seed loading completed successfully")
    except Exception as e:
        logger.error(f"Error loading RIASEC seeds: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
