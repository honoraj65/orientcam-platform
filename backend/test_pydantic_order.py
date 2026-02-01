#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Test if Pydantic conversion preserves order"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program
from app.schemas.program import ProgramListItem
from sqlalchemy.orm import joinedload

db = SessionLocal()

print("[TEST PYDANTIC CONVERSION]")

# Simulate EXACTLY what the endpoint does
query = db.query(Program).options(joinedload(Program.master_program)).filter(Program.is_active == True)
query = query.order_by(Program.department, Program.name)
programs = query.limit(20).all()

print("\n[AVANT CONVERSION PYDANTIC]")
for i, prog in enumerate(programs[:10]):
    print(f"{i+1:2}. {prog.department:55} | {prog.name}")

# Convert to Pydantic models exactly like the endpoint
program_items = [ProgramListItem.model_validate(p) for p in programs]

print("\n[APRES CONVERSION PYDANTIC]")
for i, item in enumerate(program_items[:10]):
    print(f"{i+1:2}. {item.department:55} | {item.name}")

# Convert to dict like FastAPI does
print("\n[APRES CONVERSION EN DICT]")
dicts = [item.model_dump() for item in program_items]
for i, d in enumerate(dicts[:10]):
    print(f"{i+1:2}. {d['department']:55} | {d['name']}")

db.close()
