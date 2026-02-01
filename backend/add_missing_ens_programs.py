#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Add missing ENS programs from UBertoua.pdf"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program

# Missing DIPES programs for École Normale Supérieure
missing_dipes = [
    {
        "code": "ENS-INFO-TIC-DIPES",
        "name": "DIPES en Informatique Option TIC",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Ecole Normale Superieure",
        "duration_years": 2,
        "description": "Formation des professeurs d'enseignement secondaire en Informatique option TIC",
        "career_prospects": "Professeur d'enseignement secondaire",
        "required_bac_series": ["A", "C", "D"],
        "riasec_match": "RIC",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 50,
        "is_active": True
    },
    {
        "code": "ENS-CHEM-DIPES",
        "name": "DIPES en Chimie",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Ecole Normale Superieure",
        "duration_years": 2,
        "description": "Formation des professeurs d'enseignement secondaire en Chimie",
        "career_prospects": "Professeur d'enseignement secondaire",
        "required_bac_series": ["C", "D"],
        "riasec_match": "IRC",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 50,
        "is_active": True
    },
    {
        "code": "ENS-BIO-DIPES",
        "name": "DIPES en Sciences de la Vie",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Ecole Normale Superieure",
        "duration_years": 2,
        "description": "Formation des professeurs d'enseignement secondaire en Sciences de la Vie",
        "career_prospects": "Professeur d'enseignement secondaire",
        "required_bac_series": ["C", "D"],
        "riasec_match": "IRS",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 50,
        "is_active": True
    },
    {
        "code": "ENS-EARTH-DIPES",
        "name": "DIPES en Sciences de la terre et de l'Environnement",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Ecole Normale Superieure",
        "duration_years": 2,
        "description": "Formation des professeurs d'enseignement secondaire en Sciences de la terre et de l'Environnement",
        "career_prospects": "Professeur d'enseignement secondaire",
        "required_bac_series": ["C", "D"],
        "riasec_match": "IRS",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 50,
        "is_active": True
    },
    {
        "code": "ENS-GEO-DIPES",
        "name": "DIPES en Geographie",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Ecole Normale Superieure",
        "duration_years": 2,
        "description": "Formation des professeurs d'enseignement secondaire en Geographie",
        "career_prospects": "Professeur d'enseignement secondaire",
        "required_bac_series": ["A", "C", "D"],
        "riasec_match": "SEC",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 50,
        "is_active": True
    },
    {
        "code": "ENS-HIST-DIPES",
        "name": "DIPES en Histoire",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Ecole Normale Superieure",
        "duration_years": 2,
        "description": "Formation des professeurs d'enseignement secondaire en Histoire",
        "career_prospects": "Professeur d'enseignement secondaire",
        "required_bac_series": ["A", "C", "D"],
        "riasec_match": "SEC",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 50,
        "is_active": True
    },
    {
        "code": "ENS-ALL-DIPES",
        "name": "DIPES en Allemand",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Ecole Normale Superieure",
        "duration_years": 2,
        "description": "Formation des professeurs d'enseignement secondaire en Allemand",
        "career_prospects": "Professeur d'enseignement secondaire",
        "required_bac_series": ["A", "C", "D"],
        "riasec_match": "SEC",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 50,
        "is_active": True
    },
    {
        "code": "ENS-ESP-DIPES",
        "name": "DIPES en Espagnol",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Ecole Normale Superieure",
        "duration_years": 2,
        "description": "Formation des professeurs d'enseignement secondaire en Espagnol",
        "career_prospects": "Professeur d'enseignement secondaire",
        "required_bac_series": ["A", "C", "D"],
        "riasec_match": "SEC",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 50,
        "is_active": True
    },
    {
        "code": "ENS-BIL-DIPES",
        "name": "DIPES en Lettres Bilingues",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Ecole Normale Superieure",
        "duration_years": 2,
        "description": "Formation des professeurs d'enseignement secondaire en Lettres Bilingues",
        "career_prospects": "Professeur d'enseignement secondaire",
        "required_bac_series": ["A"],
        "riasec_match": "SEC",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 50,
        "is_active": True
    },
    {
        "code": "ENS-ARAB-DIPES",
        "name": "DIPES en Arabe",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Ecole Normale Superieure",
        "duration_years": 2,
        "description": "Formation des professeurs d'enseignement secondaire en Arabe",
        "career_prospects": "Professeur d'enseignement secondaire",
        "required_bac_series": ["A"],
        "riasec_match": "SEC",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 50,
        "is_active": True
    },
    {
        "code": "ENS-CHIN-DIPES",
        "name": "DIPES en Chinois",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Ecole Normale Superieure",
        "duration_years": 2,
        "description": "Formation des professeurs d'enseignement secondaire en Chinois",
        "career_prospects": "Professeur d'enseignement secondaire",
        "required_bac_series": ["A"],
        "riasec_match": "SEC",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 50,
        "is_active": True
    },
    {
        "code": "ENS-ENG-DIPES",
        "name": "DIPES en Lettres modernes Anglaises",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Ecole Normale Superieure",
        "duration_years": 2,
        "description": "Formation des professeurs d'enseignement secondaire en Lettres modernes Anglaises",
        "career_prospects": "Professeur d'enseignement secondaire",
        "required_bac_series": ["A"],
        "riasec_match": "SEC",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 50,
        "is_active": True
    },
    {
        "code": "ENS-FRA-DIPES",
        "name": "DIPES en Lettres modernes Françaises",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Ecole Normale Superieure",
        "duration_years": 2,
        "description": "Formation des professeurs d'enseignement secondaire en Lettres modernes Françaises",
        "career_prospects": "Professeur d'enseignement secondaire",
        "required_bac_series": ["A"],
        "riasec_match": "SEC",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 50,
        "is_active": True
    },
    {
        "code": "ENS-LCC-DIPES",
        "name": "DIPES en Langues et cultures Camerounaises",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Ecole Normale Superieure",
        "duration_years": 2,
        "description": "Formation des professeurs d'enseignement secondaire en Langues et cultures Camerounaises",
        "career_prospects": "Professeur d'enseignement secondaire",
        "required_bac_series": ["A"],
        "riasec_match": "SEC",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 50,
        "is_active": True
    },
    {
        "code": "ENS-TLS-DIPES",
        "name": "DIPES en Techniques des Langages Specialises",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Ecole Normale Superieure",
        "duration_years": 2,
        "description": "Formation des professeurs d'enseignement secondaire en Techniques des Langages Specialises",
        "career_prospects": "Professeur d'enseignement secondaire",
        "required_bac_series": ["A"],
        "riasec_match": "SEC",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 50,
        "is_active": True
    },
]

# DIPEN programs
dipen_programs = [
    {
        "code": "ENS-DIPEN-I",
        "name": "DIPEN I (Diplome d'Inspecteur de l'Education Nationale)",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Ecole Normale Superieure",
        "duration_years": 2,
        "description": "Formation des inspecteurs de l'education nationale - niveau I",
        "career_prospects": "Inspecteur de l'education nationale",
        "required_bac_series": ["A", "C", "D"],
        "riasec_match": "SEC",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 30,
        "is_active": True
    },
    {
        "code": "ENS-DIPEN-II",
        "name": "DIPEN II (Diplome d'Inspecteur de l'Education Nationale)",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Ecole Normale Superieure",
        "duration_years": 2,
        "description": "Formation des inspecteurs de l'education nationale - niveau II",
        "career_prospects": "Inspecteur de l'education nationale",
        "required_bac_series": ["A", "C", "D"],
        "riasec_match": "SEC",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 30,
        "is_active": True
    },
]

# DIPCO program
dipco_program = [
    {
        "code": "ENS-DIPCO",
        "name": "DIPCO (Diplome de Conseiller d'Orientation)",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Ecole Normale Superieure",
        "duration_years": 2,
        "description": "Formation des conseillers d'orientation scolaire et professionnelle",
        "career_prospects": "Conseiller d'orientation",
        "required_bac_series": ["A", "C", "D"],
        "riasec_match": "SEC",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 40,
        "is_active": True
    },
]

def main():
    db = SessionLocal()

    all_programs = missing_dipes + dipen_programs + dipco_program

    print(f"\n[IMPORT DES FORMATIONS ENS MANQUANTES]")
    print(f"Total a importer: {len(all_programs)} formations\n")

    added = 0
    skipped = 0

    for prog_data in all_programs:
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
    print(f"Total: {len(all_programs)}")

    # Verify ENS programs count
    ens_count = db.query(Program).filter(
        Program.department == "Ecole Normale Superieure"
    ).count()

    print(f"\n[VERIFICATION]")
    print(f"Total formations ENS dans la base: {ens_count}")

    db.close()

if __name__ == "__main__":
    main()
