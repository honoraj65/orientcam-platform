"""
Migration script to add user_type column to student_profiles table
"""
import sqlite3
import os

# Get the database path
db_path = os.path.join(os.path.dirname(__file__), "orientcam.db")

print(f"Database path: {db_path}")

# Connect to the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Check if column already exists
cursor.execute("PRAGMA table_info(student_profiles)")
columns = [column[1] for column in cursor.fetchall()]

if "user_type" not in columns:
    print("Adding user_type column...")
    cursor.execute("""
        ALTER TABLE student_profiles
        ADD COLUMN user_type VARCHAR(20) DEFAULT 'new_bachelor'
    """)
    conn.commit()
    print("Column user_type added successfully!")
else:
    print("Column user_type already exists.")

# Verify
cursor.execute("PRAGMA table_info(student_profiles)")
print("\nCurrent columns in student_profiles:")
for column in cursor.fetchall():
    print(f"  - {column[1]} ({column[2]})")

conn.close()
print("\nMigration complete!")
