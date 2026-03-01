"""
Migration: Change academic_grades.grade column from INTEGER to FLOAT
This allows decimal grades (e.g., 15.5/20)
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import text
from app.core.database import engine

def migrate():
    print("[migrate] Changing academic_grades.grade from INTEGER to FLOAT...", flush=True)

    with engine.connect() as conn:
        # PostgreSQL: ALTER COLUMN TYPE
        try:
            conn.execute(text(
                "ALTER TABLE academic_grades ALTER COLUMN grade TYPE DOUBLE PRECISION USING grade::double precision"
            ))
            conn.commit()
            print("[migrate] Column type changed successfully!", flush=True)
        except Exception as e:
            print(f"[migrate] Error: {e}", flush=True)
            conn.rollback()
            raise

    # Verify
    with engine.connect() as conn:
        result = conn.execute(text(
            "SELECT column_name, data_type FROM information_schema.columns "
            "WHERE table_name = 'academic_grades' AND column_name = 'grade'"
        ))
        row = result.fetchone()
        if row:
            print(f"[migrate] Verified: grade column is now {row[1]}", flush=True)
        else:
            print("[migrate] WARNING: Could not verify column type", flush=True)

if __name__ == "__main__":
    migrate()
