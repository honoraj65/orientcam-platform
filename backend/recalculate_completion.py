"""
Script to recalculate completion percentage for all student profiles
"""
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.student_profile import StudentProfile
from app.models.academic_grade import AcademicGrade
from app.models.professional_value import ProfessionalValue

# Database setup
DATABASE_URL = "sqlite:///./orientcam.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def calculate_completion_percentage(profile: StudentProfile, db) -> int:
    """Calculate profile completion percentage based on user type

    Each section counts for 25% of the total:
    - Basic info: 25%
    - User type specific fields: 25%
    - Academic grades: 25%
    - Professional values: 25%
    """
    percentage = 0
    print(f"\n=== Calculating for profile {profile.id} ===")
    print(f"User type: {profile.user_type}")

    # Basic info (25%)
    basic_fields = [
        profile.first_name, profile.last_name, profile.phone,
        profile.gender, profile.date_of_birth, profile.city, profile.region
    ]
    basic_completed = sum(1 for field in basic_fields if field)
    basic_percentage = (basic_completed / len(basic_fields)) * 25
    percentage += basic_percentage
    print(f"Basic info: {basic_completed}/{len(basic_fields)} fields = {basic_percentage:.1f}%")

    # User type specific fields (25%)
    if profile.user_type == 'university_student':
        # University students: establishment, department, level are REQUIRED
        university_fields = [
            profile.university_establishment,
            profile.university_department,
            profile.university_level
        ]
        type_completed = sum(1 for field in university_fields if field and field.strip())
        type_percentage = (type_completed / len(university_fields)) * 25
        print(f"University fields: {type_completed}/{len(university_fields)} fields = {type_percentage:.1f}%")
        print(f"  - establishment: {profile.university_establishment}")
        print(f"  - department: {profile.university_department}")
        print(f"  - level: {profile.university_level}")
    else:  # new_bachelor
        # New bachelors: bac_series and current_education_level are REQUIRED
        bachelor_fields = [
            profile.bac_series,
            profile.current_education_level
        ]
        type_completed = sum(1 for field in bachelor_fields if field and field.strip())
        type_percentage = (type_completed / len(bachelor_fields)) * 25
        print(f"Bachelor fields: {type_completed}/{len(bachelor_fields)} fields = {type_percentage:.1f}%")
        print(f"  - bac_series: {profile.bac_series}")
        print(f"  - current_education_level: {profile.current_education_level}")
    percentage += type_percentage

    # Academic grades (25%)
    grades_count = db.query(AcademicGrade).filter(
        AcademicGrade.student_id == profile.id
    ).count()
    grades_percentage = 25 if grades_count >= 1 else 0
    percentage += grades_percentage
    print(f"Academic grades: {grades_count} grades = {grades_percentage}%")

    # Professional values (25%)
    values = db.query(ProfessionalValue).filter(
        ProfessionalValue.student_id == profile.id
    ).first()
    values_percentage = 25 if values else 0
    percentage += values_percentage
    print(f"Professional values: {'exists' if values else 'none'} = {values_percentage}%")

    final_percentage = int(percentage)
    print(f"TOTAL: {final_percentage}%")
    print(f"=== END ===\n")

    return final_percentage


def main():
    """Recalculate completion percentage for all profiles"""
    db = SessionLocal()

    try:
        # Get all profiles
        profiles = db.query(StudentProfile).all()
        print(f"Found {len(profiles)} student profiles\n")

        updated_count = 0
        for profile in profiles:
            old_percentage = profile.completion_percentage
            new_percentage = calculate_completion_percentage(profile, db)

            if old_percentage != new_percentage:
                profile.completion_percentage = new_percentage
                print(f"[OK] Updated profile {profile.id}: {old_percentage}% -> {new_percentage}%\n")
                updated_count += 1
            else:
                print(f"[-] Profile {profile.id}: No change ({old_percentage}%)\n")

        # Commit all changes
        db.commit()
        print(f"\n{'='*60}")
        print(f"[OK] Successfully updated {updated_count} profiles")
        print(f"{'='*60}")

    except Exception as e:
        print(f"\n[ERROR] Error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
