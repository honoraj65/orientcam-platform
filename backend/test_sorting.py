#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Test sorting logic"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program

db = SessionLocal()

print("[TEST DE TRI]")
print("\n1. Recuperation des programmes...")
all_programs = db.query(Program).filter(Program.is_active == True).all()
print(f"   Total: {len(all_programs)} programmes")

print("\n2. Ordre AVANT tri (premiers 10):")
for i, prog in enumerate(all_programs[:10]):
    print(f"   {i+1}. {prog.department} | {prog.name}")

print("\n3. Application du tri...")
def sort_key(prog):
    return (prog.department, prog.name)

sorted_programs = sorted(all_programs, key=sort_key)

print("\n4. Ordre APRES tri (premiers 15):")
for i, prog in enumerate(sorted_programs[:15]):
    print(f"   {i+1}. {prog.department} | {prog.name}")

print("\n5. Verification: Departements uniques dans l'ordre:")
seen_depts = []
for prog in sorted_programs:
    if prog.department not in seen_depts:
        seen_depts.append(prog.department)
        print(f"   - {prog.department}")

db.close()
