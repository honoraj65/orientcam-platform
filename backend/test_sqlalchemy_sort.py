#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Test SQLAlchemy sorting"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program
from sqlalchemy.orm import joinedload

db = SessionLocal()

print("[TEST SQLALCHEMY ORDER_BY]")

# Simulate exactly what the endpoint does
query = db.query(Program).options(joinedload(Program.master_program)).filter(Program.is_active == True)
total = query.count()
print(f"\nTotal programs: {total}")

# Apply sorting
query = query.order_by(Program.department, Program.name)

# Get first 20
programs = query.limit(20).all()

print("\n[PREMIERS 20 PROGRAMMES AVEC ORDER_BY]")
for i, prog in enumerate(programs):
    print(f"{i+1:2}. {prog.department:60} | {prog.name}")

print("\n[DEPARTEMENTS UNIQUES DANS L'ORDRE]")
all_progs = db.query(Program).filter(Program.is_active == True).order_by(Program.department, Program.name).all()
seen = []
for prog in all_progs:
    if prog.department not in seen:
        seen.append(prog.department)
        print(f"  - {prog.department}")

db.close()
