#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Remove duplicate programs with accent variations"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program
from collections import defaultdict
import unicodedata

def normalize_text(text):
    """Normalize text by removing accents and converting to lowercase"""
    # Remove accents
    nfd = unicodedata.normalize('NFD', text)
    text_without_accents = ''.join(char for char in nfd if unicodedata.category(char) != 'Mn')
    # Lowercase and strip
    return text_without_accents.lower().strip()

def main():
    db = SessionLocal()
    try:
        # Get all programs
        programs = db.query(Program).all()

        # Group by (normalized name, department, level) to find duplicates
        program_groups = defaultdict(list)
        for prog in programs:
            # Normalize name (handle accents and case)
            normalized_name = normalize_text(prog.name)
            key = (normalized_name, prog.department, prog.level)
            program_groups[key].append(prog)

        # Find and remove duplicates
        duplicates_removed = 0

        for key, progs in program_groups.items():
            if len(progs) > 1:
                print(f"\n[DUPLICATE FOUND] {len(progs)} entries for:")
                print(f"  Normalized: {key[0]}")
                print(f"  Department: {key[1]}")
                print(f"  Level: {key[2]}")
                print(f"  Variants:")

                # Prefer the one with proper accents (longer UTF-8 encoding usually means accents)
                # Sort by name length in bytes (accented chars take more bytes in UTF-8)
                progs_sorted = sorted(progs, key=lambda p: len(p.name.encode('utf-8')), reverse=True)

                for i, prog in enumerate(progs_sorted):
                    if i == 0:
                        print(f"    [KEEP] '{prog.name}' (ID: {prog.id}, Code: {prog.code})")
                    else:
                        print(f"    [DELETE] '{prog.name}' (ID: {prog.id}, Code: {prog.code})")
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
