#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Corriger la durée des formations ENS (3 ans au lieu de 2 ans)"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program

def main():
    db = SessionLocal()

    print("\n[CORRECTION DUREE FORMATIONS ENS]")
    print("="*80)

    # Récupérer toutes les formations ENS
    ens_programs = db.query(Program).filter(
        Program.department == "Ecole Normale Superieure"
    ).all()

    print(f"\nTotal formations ENS trouvées: {len(ens_programs)}")
    print(f"\nCorrection en cours...\n")

    updated = 0
    for program in ens_programs:
        if program.duration_years == 2:
            print(f"[UPDATE] {program.name}")
            print(f"         Ancienne durée: {program.duration_years} ans")
            program.duration_years = 3
            print(f"         Nouvelle durée: {program.duration_years} ans\n")
            updated += 1
        else:
            print(f"[SKIP] {program.name} - durée déjà correcte ({program.duration_years} ans)")

    db.commit()

    print(f"\n{'='*80}")
    print(f"[RESUME]")
    print(f"Formations mises à jour: {updated}")
    print(f"Total formations ENS: {len(ens_programs)}")

    # Vérification finale
    print(f"\n[VERIFICATION FINALE]")
    ens_programs_updated = db.query(Program).filter(
        Program.department == "Ecole Normale Superieure"
    ).all()

    for p in ens_programs_updated:
        print(f"  {p.name:50} - {p.duration_years} ans")

    db.close()

if __name__ == "__main__":
    main()
