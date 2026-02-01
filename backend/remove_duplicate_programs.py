#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Remove duplicate programs from database"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program
from collections import defaultdict

def main():
    db = SessionLocal()
    try:
        # Get all programs
        programs = db.query(Program).all()

        # Group by (name, department, level) to find duplicates
        program_groups = defaultdict(list)
        for prog in programs:
            # Normalize name for comparison (handle encoding issues)
            normalized_name = prog.name.lower().strip()
            key = (normalized_name, prog.department, prog.level)
            program_groups[key].append(prog)

        # Find and remove duplicates
        duplicates_removed = 0

        for key, progs in program_groups.items():
            if len(progs) > 1:
                print(f"\n[DUPLICATE FOUND] {len(progs)} entries for:")
                print(f"  Name: {progs[0].name}")
                print(f"  Department: {progs[0].department}")
                print(f"  Level: {progs[0].level}")

                # Keep the first one, remove the rest
                for i, prog in enumerate(progs):
                    if i == 0:
                        print(f"  [KEEP] ID: {prog.id}, Code: {prog.code}")
                    else:
                        print(f"  [DELETE] ID: {prog.id}, Code: {prog.code}")
                        db.delete(prog)
                        duplicates_removed += 1

        if duplicates_removed > 0:
            db.commit()
            print(f"\n[SUCCESS] Removed {duplicates_removed} duplicate programs")
        else:
            print("\n[INFO] No duplicates found")

        # Show final statistics
        programs = db.query(Program).all()
        print(f"\n[SUMMARY]")
        print(f"  Total programs: {len(programs)}")

        # Count by department
        dept_counts = defaultdict(int)
        for prog in programs:
            dept_counts[prog.department] += 1

        print(f"\n[PROGRAMS BY DEPARTMENT]")
        for dept in sorted(dept_counts.keys()):
            print(f"  {dept}: {dept_counts[dept]} formations")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    main()
