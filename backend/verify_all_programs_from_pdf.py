#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Verify all programs against official PDF - detailed analysis"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program

# Complete list from UBertoua.pdf
pdf_programs = {
    "Faculte des Sciences Juridique et Politique": {
        "formations_diplomes": [
            # Capacité non incluse (niveau pré-Licence)
            # Licence classiques
            ("Licence", "Licence en Droit Public"),
            ("Licence", "Licence en Droit Prive"),
            ("Licence", "Licence en Science Politique"),
            ("Licence", "Licence en English Law"),
            # Masters classiques
            ("Master", "Master en Carriere Judiciare"),
            ("Master", "Master en Droit des Affaires et de l'Entreprise"),
            ("Master", "Master en Droit Public"),
            ("Master", "Master en Sciences Politique"),
            ("Master", "Master en English Law"),
        ],
        "notes": "PDF mentionne aussi des Licences et Masters Professionnels mais avec des spécialisations, pas des diplômes séparés"
    },
    "Faculte des Arts, Lettres et Sciences Humaines": {
        "formations_diplomes": [
            ("Licence", "Licence en Geographie et Geomatique"),
            ("Master", "Master en Geographie et Geomatique"),
            ("Licence", "Licence en Histoire"),
            ("Master", "Master en Histoire"),
            ("Licence", "Licence en Langues Etrangeres Appliquees"),  # Une seule formation avec 5 options
            ("Master", "Master en Langues Etrangeres Appliquees"),
            ("Licence", "Licence en English and Creative Writing"),
            ("Master", "Master en English and Creative Writing"),
            ("Licence", "Licence en Francais et Entrepreneuriat du Livre"),
            ("Master", "Master en Francais et Entrepreneuriat du Livre"),
        ],
        "notes": "Langues Etrangeres Appliquees = 1 formation avec options (Allemand, Chinois, Russe, Arabe, Espagnol)"
    },
    "Faculte des Sciences": {
        "formations_diplomes": [
            ("Licence", "Licence en Energies Renouvelables"),
            ("Master", "Master en Energies Renouvelables"),
            ("Licence", "Licence en Physique et Geosciences"),
            ("Master", "Master en Physique et Geosciences"),
            ("Licence", "Licence en Chimie"),
            ("Master", "Master en Chimie"),
            ("Licence", "Licence en Biologie"),
            ("Master", "Master en Biologie"),
            ("Licence", "Licence en Mathematiques"),
            ("Master", "Master en Mathematiques"),
            ("Licence", "Licence en Statistiques"),
            ("Master", "Master en Statistiques"),
            ("Licence", "Licence en Informatique"),
            ("Master", "Master en Informatique"),
            ("Licence", "Licence en Sciences Biomedicales"),
            ("Master", "Master en Sciences Biomedicales"),
        ],
        "notes": "16 formations (8 Licences + 8 Masters)"
    },
    "Faculte des Sciences Economiques et de Gestion": {
        "formations_diplomes": [
            ("Licence", "Licence en Banque, Finance et Assurances"),
            ("Master", "Master en Banque, Finance et Assurances"),
            ("Licence", "Licence en Comptabilite, Controle, Audit"),
            ("Master", "Master en Comptabilite, Controle, Audit"),
            ("Licence", "Licence en Gestion"),
            ("Master", "Master en Gestion"),
        ],
        "notes": "6 formations (3 Licences + 3 Masters)"
    },
    "Ecole Normale Superieure": {
        "formations_diplomes": [
            # 18 DIPES
            ("Master", "DIPES en Physique"),
            ("Master", "DIPES en Mathematiques"),
            ("Master", "DIPES en Informatique Fondamentale"),
            ("Master", "DIPES en Informatique Option TIC"),
            ("Master", "DIPES en Chimie"),
            ("Master", "DIPES en Sciences de la Vie"),
            ("Master", "DIPES en Sciences de la terre et de l'Environnement"),
            ("Master", "DIPES en Geographie"),
            ("Master", "DIPES en Histoire"),
            ("Master", "DIPES en Allemand"),
            ("Master", "DIPES en Espagnol"),
            ("Master", "DIPES en Lettres Bilingues"),
            ("Master", "DIPES en Arabe"),
            ("Master", "DIPES en Chinois"),
            ("Master", "DIPES en Lettres modernes Anglaises"),
            ("Master", "DIPES en Lettres modernes Françaises"),
            ("Master", "DIPES en Langues et cultures Camerounaises"),
            ("Master", "DIPES en Techniques des Langages Specialises"),
            # 2 DIPEN
            ("Master", "DIPEN I"),
            ("Master", "DIPEN II"),
            # 1 DIPCO
            ("Master", "DIPCO"),
        ],
        "notes": "21 formations (18 DIPES + 2 DIPEN + 1 DIPCO)"
    },
    "Ecole Superieure de Transformation des Mines et des Ressources Energetiques": {
        "formations_diplomes": [
            ("Ingenieur", "Ingenieur en Genie Minier et Geologique"),
            ("Ingenieur", "Ingenieur en Genie des Materiaux et Valorisation des Ressources"),
            ("Ingenieur", "Ingenieur en Economie et Administration Miniere"),
        ],
        "notes": "3 formations (3 Ingenieurs avec specialisations internes)"
    },
    "Institut Superieur d'Agriculture, du Bois, de l'eau, et de l'environnement": {
        "formations_diplomes": [
            ("Ingenieur", "Ingenieur en Agriculture - Elevage - Aquaculture"),
            ("Ingenieur", "Ingenieur en Forets et Bois"),
            ("Ingenieur", "Ingenieur en Environnement"),
        ],
        "notes": "3 formations principales (avec specialisations: Pisciculture, Sciences de l'eau comme options)"
    },
    "Ecole Superieure des Sciences de l'Urbanisme et du Tourisme": {
        "formations_diplomes": [
            ("Ingenieur", "Ingenieur en Genie Urbain"),  # Inclut GUR + AUR
            ("Licence", "Licence Professionnelle en Tourisme et Hotellerie"),
            ("Master", "Master en Tourisme et Hotellerie"),
        ],
        "notes": "3 formations (GUR et AUR sont des options du même diplôme Ingénieur)"
    }
}

def normalize_name(name):
    """Normalize program name for comparison"""
    import unicodedata
    # Remove accents
    nfd = unicodedata.normalize('NFD', name)
    without_accents = ''.join(char for char in nfd if unicodedata.category(char) != 'Mn')
    # Lowercase and remove extra spaces
    return without_accents.lower().strip()

def main():
    db = SessionLocal()

    print("\n" + "=" * 100)
    print("VERIFICATION COMPLETE DES FORMATIONS SELON LE PDF OFFICIEL")
    print("=" * 100)

    total_pdf = 0
    total_db = 0
    total_missing = 0
    total_extra = 0

    for dept_name, info in pdf_programs.items():
        print(f"\n{'='*100}")
        print(f"DEPARTEMENT: {dept_name}")
        print(f"{'='*100}")

        expected_programs = info["formations_diplomes"]
        notes = info["notes"]

        print(f"\nNotes: {notes}")
        print(f"\nFormations attendues selon PDF: {len(expected_programs)}")

        # Get current programs in DB
        db_programs = db.query(Program).filter(
            Program.department == dept_name
        ).order_by(Program.level, Program.name).all()

        print(f"Formations actuelles dans BD: {len(db_programs)}")

        # Create normalized mappings
        expected_normalized = {
            normalize_name(f"{level} en {name.replace('Licence en ', '').replace('Master en ', '').replace('DIPES en ', '').replace('Ingenieur en ', '')}"): (level, name)
            for level, name in expected_programs
        }

        db_normalized = {
            normalize_name(p.name): p
            for p in db_programs
        }

        # Find missing programs
        missing = []
        for norm_name, (level, full_name) in expected_normalized.items():
            if norm_name not in db_normalized:
                # Try alternative matching
                found = False
                for db_norm in db_normalized.keys():
                    if norm_name in db_norm or db_norm in norm_name:
                        found = True
                        break
                if not found:
                    missing.append((level, full_name))

        # Find extra programs (in DB but not in PDF)
        extra = []
        for db_norm, prog in db_normalized.items():
            if db_norm not in expected_normalized:
                # Try alternative matching
                found = False
                for exp_norm in expected_normalized.keys():
                    if db_norm in exp_norm or exp_norm in db_norm:
                        found = True
                        break
                if not found:
                    extra.append(prog.name)

        # Display results
        print(f"\n--- ANALYSE ---")

        if missing:
            print(f"\n[MANQUANT] {len(missing)} formations absentes de la BD:")
            for level, name in missing:
                print(f"  - [{level:9}] {name}")

        if extra:
            print(f"\n[EXTRA] {len(extra)} formations dans BD mais pas dans PDF:")
            for name in extra:
                print(f"  - {name}")

        if not missing and not extra:
            print(f"\n[OK] Toutes les formations correspondent!")

        print(f"\nFormations actuelles dans la BD:")
        for p in db_programs:
            print(f"  - [{p.level:9}] {p.name}")

        total_pdf += len(expected_programs)
        total_db += len(db_programs)
        total_missing += len(missing)
        total_extra += len(extra)

    print(f"\n{'='*100}")
    print("RESUME GLOBAL")
    print(f"{'='*100}")
    print(f"Total formations selon PDF: {total_pdf}")
    print(f"Total formations dans BD: {total_db}")
    print(f"Formations manquantes: {total_missing}")
    print(f"Formations extra (non mentionnées dans PDF): {total_extra}")

    if total_missing > 0:
        print(f"\n[ACTION REQUISE] Importer {total_missing} formations manquantes")
    elif total_db > total_pdf:
        print(f"\n[ATTENTION] La BD contient {total_db - total_pdf} formations de plus que le PDF")
    else:
        print(f"\n[COMPLET] La base de données correspond au PDF!")

    db.close()

if __name__ == "__main__":
    main()
