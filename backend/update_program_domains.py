#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Mettre à jour les domaines de toutes les formations"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program

def get_domain(name, dept):
    """Déterminer le domaine selon les règles définies"""
    name_lower = name.lower()
    dept_lower = dept.lower()

    # Sciences de l'Éducation (priority)
    if ('dipes' in name_lower or 'dipen' in name_lower or
        'dipco' in name_lower or 'normale' in dept_lower):
        return "Sciences de l'Éducation"

    # Économie et Gestion (avant Sciences et Technologies)
    if ('economie' in name_lower or 'gestion' in name_lower or
        'banque' in name_lower or 'finance' in name_lower or
        'comptabilite' in name_lower or 'assurances' in name_lower or
        'commerce' in name_lower):
        return "Économie et Gestion"

    # Sciences et Technologies (exclure Génie Urbain)
    if (name_lower.find('informatique') != -1 or name_lower.find('mathematiques') != -1 or
        name_lower.find('physique') != -1 or name_lower.find('chimie') != -1 or
        name_lower.find('statistiques') != -1 or name_lower.find('energies renouvelables') != -1 or
        name_lower.find('mines') != -1 or name_lower.find('materiaux') != -1 or
        (name_lower.find('genie') != -1 and name_lower.find('urbain') == -1) or
        (name_lower.find('ingenieur') != -1 and name_lower.find('urbain') == -1 and name_lower.find('amenagement') == -1)):
        return "Sciences et Technologies"

    # Sciences de la Vie et Santé
    if 'biologie' in name_lower or 'biomedicales' in name_lower:
        return "Sciences de la Vie et Santé"

    # Géosciences et Environnement
    if (name_lower.find('geosciences') != -1 or name_lower.find('environnement') != -1 or
        name_lower.find('agriculture') != -1 or name_lower.find('forets') != -1 or
        name_lower.find('bois') != -1 or name_lower.find('eau') != -1 or
        name_lower.find('terre') != -1 or name_lower.find('geographie') != -1 or
        name_lower.find('geomatique') != -1 or name_lower.find('urbanisme') != -1 or
        name_lower.find('tourisme') != -1 or name_lower.find('hotellerie') != -1 or
        name_lower.find('elevage') != -1 or name_lower.find('aquaculture') != -1 or
        name_lower.find('genie urbain') != -1 or name_lower.find('amenagement urbain') != -1):
        return "Géosciences et Environnement"

    # Droit et Sciences Politiques
    if ('droit' in name_lower or 'juridique' in dept_lower or
        'politique' in name_lower or 'law' in name_lower or
        'judiciare' in name_lower or 'affaires' in name_lower):
        return "Droit et Sciences Politiques"

    # Lettres et Langues
    if ('lettres' in name_lower or 'langues' in name_lower or
        'anglais' in name_lower or 'francais' in name_lower or
        'allemand' in name_lower or 'espagnol' in name_lower or
        'chinois' in name_lower or 'arabe' in name_lower or
        'english' in name_lower or 'creative writing' in name_lower or
        'histoire' in name_lower):
        return "Lettres et Langues"

    return "Sciences et Technologies"  # Default

def main():
    db = SessionLocal()

    print("\n[MISE A JOUR DES DOMAINES]")
    print("="*80)

    # Récupérer tous les programmes
    all_programs = db.query(Program).order_by(Program.department, Program.name).all()

    print(f"\nTotal formations: {len(all_programs)}\n")

    # Compter par domaine
    domain_counts = {}
    updated = 0

    for p in all_programs:
        new_domain = get_domain(p.name, p.department)

        if p.domain != new_domain:
            print(f"[UPDATE] {p.name[:60]:60} -> {new_domain}")
            p.domain = new_domain
            updated += 1

        domain_counts[new_domain] = domain_counts.get(new_domain, 0) + 1

    # Commit les changements
    db.commit()

    print(f"\n{'='*80}")
    print(f"\n[RESUME]")
    print(f"Formations mises à jour: {updated}")
    print(f"Formations inchangées: {len(all_programs) - updated}")

    print(f"\n{'='*80}")
    print(f"\n[REPARTITION PAR DOMAINE]")
    print(f"\n{'='*80}\n")

    for domain in sorted(domain_counts.keys(), key=lambda x: -domain_counts[x]):
        count = domain_counts[domain]
        print(f"  {domain:40} {count:3} formations")

    print(f"\n{'='*80}")

    db.close()

if __name__ == "__main__":
    main()
