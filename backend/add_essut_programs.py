#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Importer les formations ESSUT selon le PDF officiel"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program

# Formations ESSUT selon PDF page 9
essut_programs = [
    # Cycle Ingénieur (5 ans)
    {
        "code": "ESSUT-GENIE-URBAIN",
        "name": "Ingenieur en Genie Urbain",
        "university": "Universite de Bertoua",
        "level": "Ingenieur",
        "department": "Ecole Superieure des Sciences de l'Urbanisme et du Tourisme",
        "duration_years": 5,
        "description": "Formation d'ingenieur en genie urbain couvrant l'architecture urbaine, l'assainissement urbain et l'amenagement des espaces urbains. Prepare aux metiers de la conception et de la gestion des infrastructures urbaines.",
        "objectives": "Former des ingenieurs en genie urbain capables de concevoir, planifier et gerer des projets d'urbanisme et d'infrastructures urbaines.",
        "career_prospects": "Ingenieur en Genie Urbain, Architecte urbain, Urbaniste, Chef de projet urbain",
        "required_bac_series": ["C", "D", "E", "F"],
        "min_bac_grade": 12,
        "riasec_match": "IRE",
        "registration_fee": 50000,
        "annual_tuition": 150000,
        "total_cost_3years": 800000,
        "capacity": 40,
        "is_active": True
    },
    {
        "code": "ESSUT-AMENAGEMENT-URBAIN",
        "name": "Ingenieur en Amenagement Urbain",
        "university": "Universite de Bertoua",
        "level": "Ingenieur",
        "department": "Ecole Superieure des Sciences de l'Urbanisme et du Tourisme",
        "duration_years": 5,
        "description": "Formation d'ingenieur en amenagement urbain et amenagement des sites touristiques. Couvre l'urbanisme, l'amenagement du territoire et la planification des espaces touristiques.",
        "objectives": "Former des ingenieurs urbanistes capables de concevoir des plans d'amenagement urbain et des projets d'amenagement touristique.",
        "career_prospects": "Urbaniste, Ingenieur en amenagement des sites touristiques, Chef de projet d'amenagement",
        "required_bac_series": ["C", "D", "E", "F"],
        "min_bac_grade": 12,
        "riasec_match": "IRE",
        "registration_fee": 50000,
        "annual_tuition": 150000,
        "total_cost_3years": 800000,
        "capacity": 40,
        "is_active": True
    },

    # Licence Professionnelle (3 ans)
    {
        "code": "ESSUT-TOURISME-HOTELLERIE-L",
        "name": "Licence Professionnelle en Tourisme et Hotellerie",
        "university": "Universite de Bertoua",
        "level": "Licence",
        "department": "Ecole Superieure des Sciences de l'Urbanisme et du Tourisme",
        "duration_years": 3,
        "description": "Formation professionnelle en management touristique, gestion et management hotelier, et commercialisation et services de restauration. Prepare aux metiers du tourisme et de l'hotellerie.",
        "objectives": "Former des professionnels du tourisme et de l'hotellerie capables de gerer des etablissements touristiques et hoteliers.",
        "career_prospects": "Responsable d'agence touristique, Hote/Hotesse d'accueil, Responsable des services d'hotellerie, Maitre d'hotel",
        "required_bac_series": ["A", "B", "C", "D"],
        "min_bac_grade": 10,
        "riasec_match": "ESC",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 350000,
        "capacity": 60,
        "is_active": True
    },

    # Master en Tourisme et Hotellerie (2 ans) - mentionné dans les Masters spécialisés
    {
        "code": "ESSUT-TOURISME-HOTELLERIE-M",
        "name": "Master en Tourisme et Hotellerie",
        "university": "Universite de Bertoua",
        "level": "Master",
        "department": "Ecole Superieure des Sciences de l'Urbanisme et du Tourisme",
        "duration_years": 2,
        "description": "Formation approfondie en management touristique et hotelier. Prepare aux fonctions d'encadrement dans le secteur du tourisme et de l'hotellerie.",
        "objectives": "Former des cadres superieurs capables de gerer des etablissements touristiques et hoteliers de grande envergure.",
        "career_prospects": "Directeur d'hotel, Directeur d'agence touristique, Consultant en tourisme, Responsable de site touristique",
        "required_bac_series": ["A", "B", "C", "D"],
        "min_bac_grade": 10,
        "riasec_match": "ESC",
        "registration_fee": 50000,
        "annual_tuition": 100000,
        "total_cost_3years": 250000,
        "capacity": 40,
        "is_active": True
    },
]

def main():
    db = SessionLocal()

    print("\n[IMPORT FORMATIONS ESSUT]")
    print("="*80)
    print(f"Total a importer: {len(essut_programs)} formations")
    print(f"Ecole: Ecole Superieure des Sciences de l'Urbanisme et du Tourisme\n")

    added = 0
    skipped = 0

    for prog_data in essut_programs:
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
    essut_count = db.query(Program).filter(
        Program.department == "Ecole Superieure des Sciences de l'Urbanisme et du Tourisme"
    ).count()

    print(f"\n[VERIFICATION]")
    print(f"Total formations ESSUT: {essut_count}")
    print(f"Attendu: 4 formations (2 Ingenieurs + 1 Licence Pro + 1 Master)")

    # List all
    essut_all = db.query(Program).filter(
        Program.department == "Ecole Superieure des Sciences de l'Urbanisme et du Tourisme"
    ).order_by(Program.level, Program.name).all()

    print(f"\nFormations ESSUT:")
    for p in essut_all:
        print(f"  - [{p.level:9}] {p.name:50} {p.duration_years} ans")

    db.close()

if __name__ == "__main__":
    main()
