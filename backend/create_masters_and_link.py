#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Create Master programs for all Licences and link them"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program
import uuid

def main():
    db = SessionLocal()
    try:
        # Get all Licence programs
        licences = db.query(Program).filter(Program.level == "Licence").all()
        print(f"Found {len(licences)} Licence programs")

        masters_created = 0
        links_created = 0

        for licence in licences:
            # Extract domain from licence name
            # "Licence en Informatique" -> "Informatique"
            domain_name = licence.name.replace("Licence en ", "").replace("Licence Professionnelle en ", "")

            # Check if Master already exists
            master_code = f"M-{licence.code[2:]}" if licence.code.startswith("L-") else f"M-{domain_name[:3].upper()}"
            existing_master = db.query(Program).filter(Program.code == master_code).first()

            if existing_master:
                # Link licence to existing master
                if not licence.master_program_id:
                    licence.master_program_id = existing_master.id
                    links_created += 1
                    print(f"[LINK] {licence.name} -> {existing_master.name}")
                continue

            # Create new Master program
            master = Program(
                id=str(uuid.uuid4()),
                code=master_code,
                name=f"Master en {domain_name}",
                university=licence.university,
                level="Master",
                duration_years=2,
                department=licence.department,
                description=f"Programme de Master permettant d'approfondir les connaissances acquises en Licence en {domain_name}. "
                           f"Formation avancée préparant aux métiers de haut niveau et à la recherche.",
                objectives=f"Approfondir les compétences en {domain_name}, développer l'expertise professionnelle, "
                          f"préparer à la recherche et aux postes de responsabilité.",
                career_prospects=f"Postes de cadres, experts, consultants, chercheurs en {domain_name}. "
                                f"Accès aux concours de la fonction publique de catégorie A.",
                required_bac_series=licence.required_bac_series,
                min_bac_grade=14,  # Master requires better grades
                required_subjects=licence.required_subjects,
                riasec_match=licence.riasec_match,
                registration_fee=int(licence.registration_fee * 1.2),  # 20% more expensive
                annual_tuition=int(licence.annual_tuition * 1.3),
                total_cost_3years=int(licence.annual_tuition * 1.3 * 2),  # 2 years for Master
                employment_rate=licence.employment_rate + 10 if licence.employment_rate else 85,  # Masters have better employment
                average_starting_salary=int(licence.average_starting_salary * 1.5) if licence.average_starting_salary else None,
                capacity=int(licence.capacity * 0.6),  # Fewer places in Master
                is_active=True
            )

            db.add(master)
            db.flush()  # Get the master ID

            # Link licence to master
            licence.master_program_id = master.id

            masters_created += 1
            links_created += 1
            print(f"[CREATE] Master en {domain_name} -> Linked to {licence.name}")

        db.commit()
        print(f"\n[SUCCESS] Created {masters_created} Masters, Created {links_created} links")

        # Show summary
        total_masters = db.query(Program).filter(Program.level == "Master").count()
        total_licences = db.query(Program).filter(Program.level == "Licence").count()
        linked_licences = db.query(Program).filter(
            Program.level == "Licence",
            Program.master_program_id.isnot(None)
        ).count()

        print(f"\n[SUMMARY]")
        print(f"  Total Licences: {total_licences}")
        print(f"  Total Masters: {total_masters}")
        print(f"  Licences linked to Master: {linked_licences}")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    main()
