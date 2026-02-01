#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Check for department name variations"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program
from collections import defaultdict

def main():
    db = SessionLocal()
    try:
        programs = db.query(Program).order_by(Program.department, Program.name).all()

        print("=== PROGRAMMES PAR DÉPARTEMENT (dans l'ordre) ===\n")

        current_dept = None
        for i, prog in enumerate(programs):
            if prog.department != current_dept:
                if current_dept is not None:
                    print()  # Ligne vide entre départements
                current_dept = prog.department
                print(f"\n{'='*80}")
                print(f"DÉPARTEMENT: {repr(prog.department)}")
                print(f"{'='*80}")

            print(f"  {i+1}. [{prog.level}] {prog.name}")

        print("\n\n=== VÉRIFICATION DES VARIATIONS ===\n")

        # Group by department variations
        dept_variations = defaultdict(list)
        for prog in programs:
            # Normalize for comparison
            normalized = prog.department.lower().strip()
            dept_variations[normalized].append(prog.department)

        # Check for variations
        for normalized, variations in dept_variations.items():
            unique_variations = set(variations)
            if len(unique_variations) > 1:
                print(f"[VARIATION DETECTED] {normalized}:")
                for var in unique_variations:
                    print(f"  - {repr(var)}")

    finally:
        db.close()

if __name__ == "__main__":
    main()
