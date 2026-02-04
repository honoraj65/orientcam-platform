"""
Créer des résultats RIASEC complets pour l'utilisateur de test
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User
from app.models.student_profile import StudentProfile
from app.models.riasec_test import RiasecTest
import uuid
from datetime import datetime

def create_test_riasec_results():
    """Créer des résultats RIASEC complets pour le test user"""
    db = SessionLocal()

    try:
        # Trouver l'utilisateur de test
        user = db.query(User).filter(User.email == "test@orientuniv.com").first()

        if not user:
            print("[ERROR] Utilisateur de test non trouvé. Exécutez d'abord create_test_user.py")
            return

        print(f"[OK] Utilisateur trouvé: {user.email} (ID: {user.id})")

        # Trouver le profil étudiant
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()

        if not profile:
            print("[ERROR] Profil étudiant non trouvé pour cet utilisateur")
            return

        print(f"[OK] Profil trouvé: {profile.first_name} {profile.last_name} (ID: {profile.id})")

        # Vérifier si des résultats existent déjà
        existing_test = db.query(RiasecTest).filter(RiasecTest.student_id == profile.id).first()

        if existing_test:
            print("[OK] Des résultats RIASEC existent déjà pour cet utilisateur")
            print(f"Test ID: {existing_test.id}")
            print(f"Holland Code: {existing_test.holland_code}")
            print(f"Scores:")
            print(f"  - Réaliste: {existing_test.realistic_score}")
            print(f"  - Investigateur: {existing_test.investigative_score}")
            print(f"  - Artistique: {existing_test.artistic_score}")
            print(f"  - Social: {existing_test.social_score}")
            print(f"  - Entrepreneur: {existing_test.enterprising_score}")
            print(f"  - Conventionnel: {existing_test.conventional_score}")
            return

        # Créer un nouveau test RIASEC avec des scores pour un profil ISA
        # (Investigateur, Social, Artistique - typique pour sciences/enseignement)
        test = RiasecTest(
            id=str(uuid.uuid4()),
            student_id=profile.id,
            realistic_score=45,
            investigative_score=85,
            artistic_score=75,
            social_score=80,
            enterprising_score=50,
            conventional_score=35,
            holland_code="ISA",
            raw_answers={"completed": True, "questions": []},
            test_version="1.0",
            duration_seconds=600
        )

        db.add(test)
        db.commit()

        print("[OK] Résultats RIASEC créés avec succès!")
        print(f"Test ID: {test.id}")
        print(f"Holland Code: {test.holland_code}")
        print(f"Scores:")
        print(f"  - Réaliste: {test.realistic_score}")
        print(f"  - Investigateur: {test.investigative_score}")
        print(f"  - Artistique: {test.artistic_score}")
        print(f"  - Social: {test.social_score}")
        print(f"  - Entrepreneur: {test.enterprising_score}")
        print(f"  - Conventionnel: {test.conventional_score}")

        print("\n[INFO] Profil principal: Investigateur-Social-Artistique (ISA)")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Erreur lors de la création des résultats: {e}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_test_riasec_results()
