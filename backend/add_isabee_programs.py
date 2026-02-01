#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Importer les formations ISABEE selon le PDF officiel"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program

# Formations ISABEE selon PDF page 8-9
# Durée: 3 ans (Licence), 2 ans (Master)
isabee_programs = [
    # Licences (3 ans)
    {
        "code": "ISABEE-AGRI-ELEV-AQUA-L",
        "name": "Licence en Agriculture - Elevage - Aquaculture",
        "university": "Universite de Bertoua",
        "level": "Licence",
        "department": "Institut Superieur d'Agriculture, du Bois, de l'eau, et de l'environnement",
        "duration_years": 3,
        "description": "Formation en agriculture, elevage et aquaculture couvrant l'agroeconomie, la production animale et vegetale, et l'aquaculture. Prepare les etudiants aux metiers de l'agriculture moderne et de l'elevage.",
        "objectives": "Former des ingenieurs agricoles capables de gerer des exploitations agricoles, des elevages et des fermes piscicoles.",
        "career_prospects": "Chef d'exploitation agricole, Agriculteur, Aquaculteur, Technicien en production animale",
        "required_bac_series": ["C", "D", "E", "F"],
        "min_bac_grade": 10,
        "riasec_match": "RIE",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 350000,
        "capacity": 50,
        "is_active": True
    },
    {
        "code": "ISABEE-FORETS-BOIS-L",
        "name": "Licence en Forets et Bois",
        "university": "Universite de Bertoua",
        "level": "Licence",
        "department": "Institut Superieur d'Agriculture, du Bois, de l'eau, et de l'environnement",
        "duration_years": 3,
        "description": "Formation en amenagement forestier, exploitation forestiere et gestion des operations forestieres. Couvre la sylviculture, l'inventaire forestier et la transformation du bois.",
        "objectives": "Former des ingenieurs forestiers capables de gerer durablement les ressources forestieres et les operations d'exploitation.",
        "career_prospects": "Chef de brigade d'inventaire forestier, Chef de chantier d'exploitation, Agro-forestier, Pepinieriste",
        "required_bac_series": ["C", "D", "E", "F"],
        "min_bac_grade": 10,
        "riasec_match": "RIE",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 350000,
        "capacity": 40,
        "is_active": True
    },
    {
        "code": "ISABEE-ENVIRONNEMENT-L",
        "name": "Licence en Environnement",
        "university": "Universite de Bertoua",
        "level": "Licence",
        "department": "Institut Superieur d'Agriculture, du Bois, de l'eau, et de l'environnement",
        "duration_years": 3,
        "description": "Formation en gestion de l'environnement, changement climatique, hygiene et securite environnementale. Prepare aux metiers de la protection et de la conservation de l'environnement.",
        "objectives": "Former des specialistes en environnement capables de gerer les aires protegees et les questions environnementales.",
        "career_prospects": "Conservateur des aires protegees, Charge de projet environnemental, Consultant en environnement",
        "required_bac_series": ["C", "D", "E", "F"],
        "min_bac_grade": 10,
        "riasec_match": "IRE",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 350000,
        "capacity": 40,
        "is_active": True
    },

    # Masters (2 ans)
    {
        "code": "ISABEE-AGRI-ELEV-AQUA-M",
        "name": "Master en Agriculture - Elevage - Aquaculture",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Institut Superieur d'Agriculture, du Bois, de l'eau, et de l'environnement",
        "duration_years": 2,
        "description": "Formation approfondie en agriculture, elevage et aquaculture avec specialisation en gouvernance forestiere et agribusiness. Prepare a la gestion de grandes exploitations et projets agricoles.",
        "objectives": "Former des ingenieurs agricoles de haut niveau capables de concevoir et gerer des projets agricoles d'envergure.",
        "career_prospects": "Ingenieur agricole, Responsable d'exploitation agricole, Consultant en agribusiness, Vulgarisateur piscicole",
        "required_bac_series": ["C", "D", "E", "F"],
        "min_bac_grade": 10,
        "riasec_match": "RIE",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 40,
        "is_active": True
    },
    {
        "code": "ISABEE-FORETS-BOIS-M",
        "name": "Master en Forets et Bois",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Institut Superieur d'Agriculture, du Bois, de l'eau, et de l'environnement",
        "duration_years": 2,
        "description": "Formation approfondie en amenagement forestier avec specialisation en gouvernance forestiere. Prepare a la gestion durable des forets et aux fonctions d'encadrement dans le secteur forestier.",
        "objectives": "Former des ingenieurs forestiers capables de concevoir des plans d'amenagement forestier et de diriger des operations forestieres.",
        "career_prospects": "Ingenieur forestier, Responsable d'amenagement forestier, Consultant en foresterie",
        "required_bac_series": ["C", "D", "E", "F"],
        "min_bac_grade": 10,
        "riasec_match": "RIE",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 30,
        "is_active": True
    },
    {
        "code": "ISABEE-ENVIRONNEMENT-M",
        "name": "Master en Environnement",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Institut Superieur d'Agriculture, du Bois, de l'eau, et de l'environnement",
        "duration_years": 2,
        "description": "Formation approfondie en gestion de l'environnement avec specialisation en changement climatique et hygiene environnementale. Prepare aux fonctions d'encadrement dans la protection de l'environnement.",
        "objectives": "Former des experts en environnement capables de concevoir et mettre en oeuvre des politiques environnementales.",
        "career_prospects": "Ingenieur environnement, Expert en changement climatique, Responsable HSE, Consultant environnemental",
        "required_bac_series": ["C", "D", "E", "F"],
        "min_bac_grade": 10,
        "riasec_match": "IRE",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 30,
        "is_active": True
    },
]

def main():
    db = SessionLocal()

    print("\n[IMPORT FORMATIONS ISABEE]")
    print("="*80)
    print(f"Total a importer: {len(isabee_programs)} formations")
    print(f"Institut: Institut Superieur d'Agriculture, du Bois, de l'eau, et de l'environnement\n")

    added = 0
    skipped = 0

    for prog_data in isabee_programs:
        # Check if exists
        existing = db.query(Program).filter(Program.code == prog_data["code"]).first()

        if existing:
            print(f"[SKIP] {prog_data['name']} - existe deja")
            skipped += 1
            continue

        # Create
        program = Program(**prog_data)
        db.add(program)
        print(f"[OK] {prog_data['name']}")
        print(f"     Niveau: {prog_data['level']} - Duree: {prog_data['duration_years']} ans")
        added += 1

    db.commit()

    print(f"\n{'='*80}")
    print(f"[RESUME]")
    print(f"Formations ajoutees: {added}")
    print(f"Formations ignorees: {skipped}")

    # Verification
    isabee_count = db.query(Program).filter(
        Program.department == "Institut Superieur d'Agriculture, du Bois, de l'eau, et de l'environnement"
    ).count()

    print(f"\n[VERIFICATION]")
    print(f"Total formations ISABEE: {isabee_count}")
    print(f"Attendu: 6 formations (3 Licences + 3 Masters)")

    db.close()

if __name__ == "__main__":
    main()
