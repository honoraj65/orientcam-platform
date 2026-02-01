#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Add missing FSJP programs from PDF"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program

# Missing FSJP programs from PDF
missing_programs = [
    {
        "code": "FSJP-ENGLISH-LAW-L",
        "name": "Licence en English Law",
        "university": "Universite de Bertoua",
        "level": "Licence",
        "department": "Faculte des Sciences Juridique et Politique",
        "duration_years": 3,
        "description": "Formation en droit anglais et common law, permettant aux etudiants de comprendre les systemes juridiques de tradition britannique. Programme en anglais couvrant le droit constitutionnel, le droit des contrats, le droit des torts, et le droit criminel selon la tradition anglo-saxonne.",
        "objectives": "Former des juristes bilingues maitrisant le systeme de common law et capables de travailler dans des contextes juridiques internationaux ou dans les regions anglophones du Cameroun.",
        "career_prospects": "Avocat international, juriste d'entreprise multinationale, magistrat, conseiller juridique, traducteur juridique, enseignant-chercheur",
        "required_bac_series": ["A", "B"],
        "min_bac_grade": 12,
        "riasec_match": "ESC",
        "registration_fee": 50000,
        "annual_tuition": 75000,
        "total_cost_3years": 200000,
        "capacity": 40,
        "is_active": True
    },
    {
        "code": "FSJP-ENGLISH-LAW-M",
        "name": "Master en English Law",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Faculte des Sciences Juridique et Politique",
        "duration_years": 2,
        "description": "Formation approfondie en droit anglais et common law, avec specialisation en droit des affaires international, droit compare, et pratique juridique dans les systemes de common law. Programme entierement en anglais.",
        "objectives": "Former des specialistes du droit anglais capables d'exercer dans des contextes juridiques internationaux et de conseiller sur les questions de droit compare.",
        "career_prospects": "Avocat international, juriste senior d'entreprise multinationale, magistrat, conseiller juridique, enseignant-chercheur en droit compare",
        "required_bac_series": ["A", "B"],
        "min_bac_grade": 12,
        "riasec_match": "ESC",
        "registration_fee": 50000,
        "annual_tuition": 75000,
        "total_cost_3years": 200000,
        "capacity": 30,
        "is_active": True
    },
    {
        "code": "FSJP-CARRIERE-JUD-M",
        "name": "Master en Carriere Judiciare",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Faculte des Sciences Juridique et Politique",
        "duration_years": 2,
        "description": "Formation specialisee preparant aux carrieres de la magistrature et de l'administration judiciaire. Programme couvrant la procedure civile et penale, la deontologie judiciaire, la redaction des decisions de justice, et l'organisation judiciaire camerounaise.",
        "objectives": "Former des professionnels de la justice capables d'exercer comme magistrats, greffiers, ou dans l'administration judiciaire.",
        "career_prospects": "Magistrat (juge, procureur), greffier en chef, administrateur judiciaire, conseiller juridique dans l'administration publique",
        "required_bac_series": ["A", "B"],
        "min_bac_grade": 13,
        "riasec_match": "ESC",
        "registration_fee": 50000,
        "annual_tuition": 75000,
        "total_cost_3years": 200000,
        "capacity": 40,
        "is_active": True
    },
    {
        "code": "FSJP-AFFAIRES-ENT-M",
        "name": "Master en Droit des Affaires et de l'Entreprise",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Faculte des Sciences Juridique et Politique",
        "duration_years": 2,
        "description": "Formation specialisee en droit des affaires, droit commercial, droit des societes, droit fiscal, et droit du travail. Prepare les etudiants a conseiller les entreprises sur les aspects juridiques de leurs activites.",
        "objectives": "Former des juristes d'entreprise capables d'accompagner les entreprises dans leurs operations juridiques et commerciales.",
        "career_prospects": "Juriste d'entreprise, avocat d'affaires, conseil juridique et fiscal, directeur juridique, notaire, magistrat specialise en droit commercial",
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

    print(f"\n[IMPORT DES FORMATIONS FSJP MANQUANTES]")
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
        added += 1

    db.commit()

    print(f"\n[RESUME]")
    print(f"Formations ajoutees: {added}")
    print(f"Formations ignorees (doublons): {skipped}")

    # Verify FSJP programs count
    fsjp_count = db.query(Program).filter(
        Program.department == "Faculte des Sciences Juridique et Politique"
    ).count()

    print(f"\n[VERIFICATION]")
    print(f"Total formations FSJP dans la base: {fsjp_count}")
    print(f"Attendu selon PDF: 9 (3 Licences + 6 Masters)")

    # List all FSJP programs
    print(f"\nFormations FSJP:")
    fsjp_programs = db.query(Program).filter(
        Program.department == "Faculte des Sciences Juridique et Politique"
    ).order_by(Program.level, Program.name).all()

    for p in fsjp_programs:
        print(f"  [{p.level:9}] {p.name}")

    db.close()

if __name__ == "__main__":
    main()
