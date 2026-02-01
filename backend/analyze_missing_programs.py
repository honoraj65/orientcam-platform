#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Analyze missing programs by establishment based on UBertoua official data"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program

# Expected programs for each establishment based on UBertoua.pdf
expected_programs = {
    "Ecole Normale Superieure": {
        "expected": 21,  # 18 DIPES + 2 DIPEN + 1 DIPCO
        "notes": "DIPES I & II en 18 disciplines, DIPEN I & II, DIPCO"
    },
    "Faculte des Sciences": {
        "expected": 16,  # 8 Licences + 8 Masters (Biologie, Chimie, Informatique, Maths, Physique, Stats, Energies Renouvelables, Sciences Biomedicales)
        "notes": "Licence + Master en: Biologie, Chimie, Informatique, Mathematiques, Physique et Geosciences, Statistiques, Energies Renouvelables, Sciences Biomedicales"
    },
    "Faculte des Arts, Lettres et Sciences Humaines": {
        "expected": 10,  # 5 Licences + 5 Masters
        "notes": "Licence + Master en: English and Creative Writing, Francais et Entrepreneuriat du Livre, Geographie et Geomatique, Histoire, Langues Etrangeres Appliquees"
    },
    "Faculte des Sciences Economiques et de Gestion": {
        "expected": 6,  # 3 Licences + 3 Masters
        "notes": "Licence + Master en: Banque Finance Assurances, Comptabilite Controle Audit, Gestion"
    },
    "Faculte des Sciences Juridique et Politique": {
        "expected": 6,  # 3 Licences + 3 Masters (Droit Prive, Droit Public, Science Politique)
        "notes": "Licence + Master en: Droit Prive, Droit Public, Science Politique"
    },
    "Ecole Superieure de Transformation des Mines et des Ressources Energetiques": {
        "expected": 3,  # 3 Ingenieurs
        "notes": "Ingenieur en: Economie et Administration Miniere, Genie Minier et Geologique, Genie des Materiaux et Valorisation"
    },
    "Ecole Superieure des Sciences de l'Urbanisme et du Tourisme": {
        "expected": 3,  # 1 Ingenieur + 1 Licence + 1 Master
        "notes": "Ingenieur en Genie Urbain, Licence + Master en Tourisme et Hotellerie"
    },
    "Institut Superieur d'Agriculture, du Bois, de l'eau, et de l'environnement": {
        "expected": 3,  # 3 Ingenieurs
        "notes": "Ingenieur en: Agriculture-Elevage-Aquaculture, Environnement, Forets et Bois"
    }
}

def main():
    db = SessionLocal()

    print("\n[ANALYSE DES FORMATIONS PAR ETABLISSEMENT]\n")
    print("=" * 80)

    total_in_db = 0
    total_expected = 0
    missing_total = 0

    for dept_name, info in expected_programs.items():
        current_count = db.query(Program).filter(
            Program.department == dept_name
        ).count()

        expected_count = info["expected"]
        missing = expected_count - current_count

        total_in_db += current_count
        total_expected += expected_count
        missing_total += max(0, missing)

        status = "[OK]" if current_count >= expected_count else "[INCOMPLET]"

        print(f"\n{status} {dept_name}")
        print(f"  Actuel: {current_count} formations")
        print(f"  Attendu: {expected_count} formations")
        if missing > 0:
            print(f"  Manquant: {missing} formations")
        print(f"  Notes: {info['notes']}")

        # List current programs
        programs = db.query(Program).filter(
            Program.department == dept_name
        ).order_by(Program.name).all()

        if programs:
            print(f"  Programmes actuels:")
            for p in programs:
                print(f"    - [{p.level:9}] {p.name}")

    print("\n" + "=" * 80)
    print(f"\n[RESUME GLOBAL]")
    print(f"Total formations dans la base: {total_in_db}")
    print(f"Total formations attendues: {total_expected}")
    print(f"Total formations manquantes: {missing_total}")

    if missing_total > 0:
        print(f"\n[ACTION REQUISE]")
        print(f"Il faut importer {missing_total} formations supplementaires")
    else:
        print(f"\n[COMPLET]")
        print(f"Toutes les formations attendues sont presentes dans la base!")

    db.close()

if __name__ == "__main__":
    main()
