"""
Script to add financial_situation column to student_profiles table
Run this script to migrate existing data
"""
import sqlite3
from pathlib import Path

# Path to the database
DB_PATH = Path(__file__).parent / "orientcam.db"

def migrate():
    """Add financial_situation column"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        # Check if column already exists
        cursor.execute("PRAGMA table_info(student_profiles)")
        columns = [column[1] for column in cursor.fetchall()]

        if 'financial_situation' not in columns:
            print("Adding financial_situation column...")
            cursor.execute("""
                ALTER TABLE student_profiles
                ADD COLUMN financial_situation VARCHAR(50)
            """)
            conn.commit()
            print("✓ Column added successfully!")
        else:
            print("Column financial_situation already exists")

        # Optional: Migrate existing max_annual_budget values to financial_situation
        print("\nMigrating existing budget values to financial_situation...")
        cursor.execute("""
            UPDATE student_profiles
            SET financial_situation = CASE
                WHEN max_annual_budget IS NULL THEN NULL
                WHEN max_annual_budget < 500000 THEN 'Très faible'
                WHEN max_annual_budget < 1000000 THEN 'Faible'
                WHEN max_annual_budget < 2000000 THEN 'Moyen'
                WHEN max_annual_budget < 5000000 THEN 'Bon'
                ELSE 'Très bon'
            END
            WHERE financial_situation IS NULL AND max_annual_budget IS NOT NULL
        """)
        conn.commit()
        affected = cursor.rowcount
        print(f"✓ Migrated {affected} existing records")

    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("=" * 50)
    print("Database Migration: Add financial_situation")
    print("=" * 50)
    migrate()
    print("\nMigration completed!")
