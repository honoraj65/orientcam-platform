"""
Migration script to add university fields to student_profiles table
"""
import sqlite3
import os

# Get the database path
db_path = os.path.join(os.path.dirname(__file__), "orientcam.db")

print(f"Database path: {db_path}")

# Connect to the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Check existing columns
cursor.execute("PRAGMA table_info(student_profiles)")
columns = [column[1] for column in cursor.fetchall()]

# Add university_establishment if not exists
if "university_establishment" not in columns:
    print("Adding university_establishment column...")
    cursor.execute("""
        ALTER TABLE student_profiles
        ADD COLUMN university_establishment VARCHAR(50)
    """)
    print("Column university_establishment added successfully!")
else:
    print("Column university_establishment already exists.")

# Add university_department if not exists
if "university_department" not in columns:
    print("Adding university_department column...")
    cursor.execute("""
        ALTER TABLE student_profiles
        ADD COLUMN university_department VARCHAR(100)
    """)
    print("Column university_department added successfully!")
else:
    print("Column university_department already exists.")

# Add university_level if not exists
if "university_level" not in columns:
    print("Adding university_level column...")
    cursor.execute("""
        ALTER TABLE student_profiles
        ADD COLUMN university_level VARCHAR(50)
    """)
    print("Column university_level added successfully!")
else:
    print("Column university_level already exists.")

conn.commit()

# Verify
cursor.execute("PRAGMA table_info(student_profiles)")
print("\nCurrent columns in student_profiles:")
for column in cursor.fetchall():
    print(f"  - {column[1]} ({column[2]})")

conn.close()
print("\nMigration complete!")
