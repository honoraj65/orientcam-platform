#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Add the 2 remaining missing programs"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program

# Missing programs
missing_programs = [
    {
        "code": "FS-BIOMED-M",
        "name": "Master en Sciences Biomedicales",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Faculte des Sciences",
        "duration_years": 2,
        "description": "Formation approfondie en sciences biomedicales, couvrant la biologie moleculaire, la biochimie, la physiologie, l'immunologie et les techniques de recherche biomedicale. Prepare les etudiants a la recherche en sante et aux carrieres dans le secteur biomedical.",
        "objectives": "Former des specialistes en sciences biomedicales capables de mener des recherches et de contribuer au developpement du secteur de la sante.",
        "career_prospects": "Chercheur en laboratoire biomedical, technicien de recherche clinique, specialiste en diagnostic medical, enseignant-chercheur, responsable de laboratoire d'analyses medicales",
        "required_bac_series": ["C", "D"],
        "min_bac_grade": 12,
        "riasec_match": "IRS",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 40,
        "is_active": True
    },
    {
        "code": "FSJP-DROIT-PRIVE-M",
        "name": "Master en Droit Prive",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Faculte des Sciences Juridique et Politique",
        "duration_years": 2,
        "description": "Formation specialisee en droit prive, incluant le droit civil, le droit commercial, le droit des affaires, le droit de la famille et le droit des contrats. Prepare les etudiants a exercer comme juristes, avocats ou conseillers juridiques dans le secteur prive.",
        "objectives": "Former des juristes specialises en droit prive capables d'intervenir dans tous les domaines du droit qui concernent les relations entre personnes privees.",
        "career_prospects": "Avocat, juriste d'entreprise, notaire, conseiller juridique, magistrat, enseignant-chercheur en droit",
        "required_bac_series": ["A", "B"],
        "min_bac_grade": 12,
        "riasec_match": "ESC",
        "registration_fee": 50000,
        "annual_tuition": 75000,
        "total_cost_3years": 200000,
        "capacity": 50,
        "is_active": True
    },
]

def main():
    db = SessionLocal()

    print(f"\n[IMPORT DES FORMATIONS MANQUANTES]")
    print(f"Total a importer: {len(missing_programs)} formations\n")

    added = 0
    skipped = 0

    for prog_data in missing_programs:
        # Check if program already exists
        existing = db.query(Program).filter(Program.code == prog_data["code"]).first()

        if existing:
            print(f"[SKIP] {prog_data['name']} (code: {prog_data['code']}) - existe deja")
            skipped += 1
            continue

        # Create new program
        program = Program(**prog_data)
        db.add(program)
        print(f"[OK] {prog_data['name']} (code: {prog_data['code']})")
        print(f"     Departement: {prog_data['department']}")
        added += 1

    db.commit()

    print(f"\n[RESUME]")
    print(f"Formations ajoutees: {added}")
    print(f"Formations ignorees (doublons): {skipped}")
    print(f"Total: {len(missing_programs)}")

    # Verify total programs count
    total_count = db.query(Program).count()

    print(f"\n[VERIFICATION]")
    print(f"Total formations dans la base: {total_count}")

    # Check each department
    fs_count = db.query(Program).filter(
        Program.department == "Faculte des Sciences"
    ).count()

    fsjp_count = db.query(Program).filter(
        Program.department == "Faculte des Sciences Juridique et Politique"
    ).count()

    print(f"  - Faculte des Sciences: {fs_count} formations (attendu: 16)")
    print(f"  - Faculte des Sciences Juridique et Politique: {fsjp_count} formations (attendu: 6)")

    db.close()

if __name__ == "__main__":
    main()
