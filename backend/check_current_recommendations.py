"""Check current recommendations in database"""
import sys
sys.path.insert(0, 'C:\\Users\\GBK TECH\\backend')

from app.core.database import SessionLocal
from app.models.student_profile import StudentProfile
from app.models.recommendation import Recommendation
from sqlalchemy import desc

db = SessionLocal()

try:
    # Find the new_bachelor student
    student_profile = db.query(StudentProfile).filter(
        StudentProfile.user_type == "new_bachelor"
    ).first()

    if not student_profile:
        print("[ERROR] No new_bachelor student found")
        sys.exit(1)

    print(f"[OK] Student profile: {student_profile.id}")

    # Get all recommendations
    recommendations = db.query(Recommendation).filter(
        Recommendation.student_id == student_profile.id
    ).order_by(desc(Recommendation.total_score)).all()

    print(f"\n[INFO] Total recommendations: {len(recommendations)}")

    # Show all recommendations with details
    print("\n[INFO] All recommendations:")
    for i, rec in enumerate(recommendations, 1):
        program = rec.program
        print(f"\n{i:2d}. Score: {rec.total_score}% | Ranking: {rec.ranking}")
        print(f"    Code: {program.code}")
        print(f"    Name: {program.name}")
        print(f"    Level: {program.level}")
        print(f"    Department: {program.department}")

        # Check if it's linked to a master
        if program.master_program_id:
            print(f"    [!] HAS MASTER LINK: {program.master_program_id}")

        if program.level == "Ingenieur":
            print(f"    >>> [INGENIEUR] <<<")

    # Count by level
    levels = {}
    for rec in recommendations:
        level = rec.program.level
        levels[level] = levels.get(level, 0) + 1

    print("\n[INFO] Recommendations by level:")
    for level, count in sorted(levels.items()):
        print(f"  - {level}: {count}")

finally:
    db.close()
