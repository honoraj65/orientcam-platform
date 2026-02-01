"""
Script to add university field to programs table
"""
from app.core.database import SessionLocal, engine
from sqlalchemy import text

def add_university_field():
    """Add university field to programs table"""
    db = SessionLocal()
    try:
        # Add university column to programs table
        print("[INFO] Adding university column to programs table...")
        db.execute(text("""
            ALTER TABLE programs
            ADD COLUMN university STRING(100)
        """))
        db.commit()
        print("[OK] Successfully added university column")

    except Exception as e:
        print(f"[ERROR] Error adding university column: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_university_field()
