#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Test master program serialization"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program
from app.schemas.program import ProgramListItem
import json

db = SessionLocal()

licence = db.query(Program).filter(Program.code == 'FS-INFO-L3').first()

print(f"master_program_id: {licence.master_program_id}")
print(f"master_program: {licence.master_program}")

if licence.master_program:
    print(f"master_program.id: {licence.master_program.id}")
    print(f"master_program.name: {licence.master_program.name}")

try:
    item = ProgramListItem.model_validate(licence)
    data = item.model_dump()
    print("\nSerialized:")
    print(json.dumps(data, indent=2, ensure_ascii=False))
except Exception as e:
    print(f"\nError: {e}")
    import traceback
    traceback.print_exc()

db.close()
