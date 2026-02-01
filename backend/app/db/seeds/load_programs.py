"""
Seed loader for academic programs
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


def load_programs(db: Session) -> None:
    """Load academic programs from JSON file"""

    # Check if already loaded
    existing_count = db.query(Program).count()
    if existing_count > 0:
        logger.info(f"Programs already loaded ({existing_count} programs)")
        return

    # Load JSON file
    json_path = Path(__file__).parent / "programs.json"
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    logger.info(f"Loading {len(data['programs'])} programs from {data['university']}")

    # Insert programs
    for prog_data in data["programs"]:
        program = Program(
            code=prog_data["code"],
            name=prog_data["name"],
            level=prog_data["level"],
            department=prog_data["department"],
            description=prog_data["description"],
            objectives=prog_data["objectives"],
            career_prospects=prog_data["career_prospects"],
            required_bac_series=prog_data["prerequisites"]["required_bac_series"],
            min_bac_grade=prog_data["prerequisites"]["min_bac_grade"],
            required_subjects=prog_data["prerequisites"]["required_subjects"],
            riasec_match=prog_data["riasec_match"],
            registration_fee=prog_data["costs"]["registration_fee"],
            annual_tuition=prog_data["costs"]["annual_tuition"],
            total_cost_3years=prog_data["costs"]["total_cost_3years"],
            employment_rate=prog_data["employment_rate"],
            average_starting_salary=prog_data["average_starting_salary"],
            capacity=prog_data["capacity"],
            is_active=True
        )
        db.add(program)
        db.flush()

        logger.info(f"Created program: {prog_data['code']} - {prog_data['name']}")

        # Insert program subjects
        for subject_data in prog_data["subjects"]:
            subject = ProgramSubject(
                program_id=program.id,
                name=subject_data["name"],
                credits=subject_data["credits"],
                semester=subject_data["semester"],
                is_mandatory=subject_data["is_mandatory"]
            )
            db.add(subject)

        subject_count = len(prog_data["subjects"])
        logger.info(f"  Added {subject_count} subjects")

    db.commit()

    total_programs = db.query(Program).count()
    total_subjects = db.query(ProgramSubject).count()
    logger.info(f"Successfully loaded {total_programs} programs with {total_subjects} subjects")


def main():
    """Main entry point"""
    logger.info("Starting programs seed loader...")

    db = SessionLocal()
    try:
        load_programs(db)
        logger.info("Programs seed loading completed successfully")
    except Exception as e:
        logger.error(f"Error loading programs seeds: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
