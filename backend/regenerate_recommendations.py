"""Regenerate recommendations for all students"""
import sys
sys.path.insert(0, 'C:\\Users\\GBK TECH\\backend')

from app.core.database import SessionLocal
from app.models.recommendation import Recommendation
from app.models.student_profile import StudentProfile

db = SessionLocal()

try:
    # Get all student profiles
    profiles = db.query(StudentProfile).all()
    print(f"Found {len(profiles)} student profiles")

    # Delete all existing recommendations
    deleted_count = db.query(Recommendation).delete()
    db.commit()
    print(f"Deleted {deleted_count} old recommendations")

    print("\nRecommendations deleted successfully.")
    print("Please click 'Générer de nouvelles recommandations' on the /recommendations page")

finally:
    db.close()
