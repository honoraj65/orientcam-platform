"""
Add riasec_test_drafts table for saving test progress
"""
import sqlite3
import os
from datetime import datetime

db_path = os.path.join(os.path.dirname(__file__), 'orientcam.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("[INFO] Ajout de la table riasec_test_drafts...")

# Check if table exists
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='riasec_test_drafts'")
table_exists = cursor.fetchone() is not None

if table_exists:
    print("[OK] La table 'riasec_test_drafts' existe déjà")
else:
    # Create riasec_test_drafts table
    cursor.execute("""
        CREATE TABLE riasec_test_drafts (
            id TEXT PRIMARY KEY,
            student_id TEXT NOT NULL UNIQUE,
            answers TEXT NOT NULL DEFAULT '{}',
            current_question_index INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE
        )
    """)

    # Create index on student_id
    cursor.execute("""
        CREATE INDEX ix_riasec_test_drafts_student_id ON riasec_test_drafts (student_id)
    """)

    conn.commit()
    print("[OK] Table 'riasec_test_drafts' créée avec succès")

conn.close()
print("[OK] Migration terminée")
