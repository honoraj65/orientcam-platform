"""
Migration script to add duration_years column and populate values
"""
import sqlite3

# Connect to database
conn = sqlite3.connect('orientcam.db')
cursor = conn.cursor()

print("Adding duration_years column...")

# Add column
try:
    cursor.execute("ALTER TABLE programs ADD COLUMN duration_years INTEGER")
    print("[OK] Column added")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e):
        print("[INFO] Column already exists")
    else:
        raise

# Update values based on level
print("\nUpdating duration values based on level...")

updates = [
    ("Licence", 3),
    ("Master", 2),
    ("Ingenieur", 5),
]

for level, duration in updates:
    cursor.execute(
        "UPDATE programs SET duration_years = ? WHERE level = ?",
        (duration, level)
    )
    count = cursor.rowcount
    print(f"  - {level}: {count} programmes mis a jour avec {duration} ans")

# Commit changes
conn.commit()

# Verify
print("\nVerification:")
cursor.execute("SELECT level, duration_years, COUNT(*) FROM programs GROUP BY level, duration_years")
results = cursor.fetchall()
for row in results:
    level, duration, count = row
    print(f"  {level}: {duration} ans ({count} programmes)")

# Close connection
conn.close()

print("\n[OK] Migration terminee")
