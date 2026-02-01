#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Script to count programs in database"""

import sqlite3
from collections import Counter

db_path = r"C:\Users\GBK TECH\backend\orientcam.db"

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Total programs
cursor.execute("SELECT COUNT(*) FROM programs")
total = cursor.fetchone()[0]
print(f"Total programmes: {total}")

# By university
print(f"\nPar universite:")
cursor.execute("SELECT university, COUNT(*) FROM programs GROUP BY university ORDER BY university")
for uni, count in cursor.fetchall():
    uni_name = uni if uni else "Non specifiee"
    print(f"  {uni_name}: {count}")

# By level
print(f"\nPar niveau:")
cursor.execute("SELECT level, COUNT(*) FROM programs GROUP BY level ORDER BY level")
for level, count in cursor.fetchall():
    print(f"  {level}: {count}")

# List all programs
print(f"\nListe complete des programmes:")
cursor.execute("SELECT name, level, university FROM programs ORDER BY university, level, name")
for i, (name, level, uni) in enumerate(cursor.fetchall(), 1):
    uni_name = uni if uni else "Non specifiee"
    print(f"  {i}. [{level}] {name} - {uni_name}")

conn.close()
