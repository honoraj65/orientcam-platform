#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Vérifier les données des programmes"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program

def main():
    db = SessionLocal()

    programs = db.query(Program).limit(5).all()

    print("\n[ECHANTILLON DE PROGRAMMES - 5 premiers]")
    print("="*80)

    for p in programs:
        print(f"\nCode: {p.code}")
        print(f"Nom: {p.name}")
        print(f"Durée: {p.duration_years} ans")
        print(f"Taux d'emploi: {p.employment_rate}%" if p.employment_rate else "Taux d'emploi: Non défini")
        print(f"Frais annuels: {p.annual_tuition:,} FCFA" if hasattr(p, 'annual_tuition') else "Frais: Non défini")

    print(f"\n{'='*80}")
    
    # Statistiques
    total = db.query(Program).count()
    with_employment = db.query(Program).filter(Program.employment_rate.isnot(None)).count()
    
    print(f"\n[STATISTIQUES]")
    print(f"Total programmes: {total}")
    print(f"Avec taux d'emploi: {with_employment}")
    print(f"Sans taux d'emploi: {total - with_employment}")

    db.close()

if __name__ == "__main__":
    main()
