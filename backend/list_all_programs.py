#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""List all programs by department"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program

db = SessionLocal()

programs = db.query(Program).filter(Program.is_active == True).order_by(Program.department, Program.name).all()

print('[LISTE COMPLETE DES FORMATIONS PAR DEPARTEMENT]\n')

current_dept = None
for p in programs:
    if p.department != current_dept:
        current_dept = p.department
        print(f'\n=== {current_dept} ===')
    print(f'  [{p.level:8}] {p.name}')

print(f'\n\n[TOTAL: {len(programs)} formations]')

db.close()
