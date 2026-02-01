#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Normalize department names for consistency"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program

def main():
    db = SessionLocal()
    try:
        # Mapping of inconsistent names to standardized names
        department_mapping = {
            "Sciences et Technologies": "Faculte des Sciences",
            "Sciences Économiques et de Gestion": "Faculte des Sciences Economiques et de Gestion",
            "Sciences économiques et de Gestion": "Faculte des Sciences Economiques et de Gestion",
        }

        programs = db.query(Program).all()
        updated = 0

        for program in programs:
            if program.department in department_mapping:
                old_dept = program.department
                new_dept = department_mapping[old_dept]
                program.department = new_dept
                updated += 1
                print(f"[UPDATE] {program.name}: {old_dept} -> {new_dept}")

        db.commit()
        print(f"\n[SUCCESS] Updated {updated} programs")

        # Show final list of departments
        programs = db.query(Program).all()
        depts = sorted(set([p.department for p in programs]))
        print(f"\n[DEPARTMENTS] Final list ({len(depts)} departments):")
        for dept in depts:
            count = len([p for p in programs if p.department == dept])
            print(f"  - {dept}: {count} formations")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    main()
