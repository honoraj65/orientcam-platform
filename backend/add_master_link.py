#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Add master_program_id column to programs table"""

import sqlite3

db_path = r"C:\Users\GBK TECH\backend\orientcam.db"

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # Add master_program_id column
    cursor.execute("ALTER TABLE programs ADD COLUMN master_program_id TEXT")
    conn.commit()
    print("[OK] Column master_program_id added successfully")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e):
        print("[INFO] Column master_program_id already exists")
    else:
        raise e

conn.close()
