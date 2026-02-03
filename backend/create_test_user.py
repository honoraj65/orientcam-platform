"""
Créer un utilisateur de test pour les tests E2E Playwright
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.user import User
from app.models.student_profile import StudentProfile
from app.core.security import hash_password
import uuid

def create_test_user():
    """Créer l'utilisateur de test pour Playwright"""
    db = SessionLocal()

    try:
        # Vérifier si l'utilisateur existe déjà
        existing_user = db.query(User).filter(User.email == "test@orientuniv.com").first()

        if existing_user:
            print("[OK] Utilisateur de test existe déjà")
            print(f"Email: test@orientuniv.com")
            print(f"ID: {existing_user.id}")
            return existing_user.id

        # Créer l'utilisateur
        user = User(
            id=str(uuid.uuid4()),
            email="test@orientuniv.com",
            password_hash=hash_password("Test123456!"),
            is_active=True,
            is_verified=True
        )

        db.add(user)
        db.flush()

        # Créer le profil étudiant
        from datetime import date
        profile = StudentProfile(
            id=str(uuid.uuid4()),
            user_id=user.id,
            first_name="Test",
            last_name="User",
            phone="+237600000000",
            date_of_birth=date(2000, 1, 1),
            gender="M",
            user_type="new_bachelor",
            bac_series="D (Math-Sciences)",
            current_education_level="Terminale",
            city="Bertoua",
            region="Est",
            completion_percentage=80
        )

        db.add(profile)
        db.commit()

        print("[OK] Utilisateur de test créé avec succès!")
        print(f"Email: test@orientuniv.com")
        print(f"Mot de passe: Test123456!")
        print(f"User ID: {user.id}")
        print(f"Profile ID: {profile.id}")
        print(f"Type: {profile.user_type}")
        print(f"Complétion: {profile.completion_percentage}%")

        return user.id

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Erreur lors de la création de l'utilisateur: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
