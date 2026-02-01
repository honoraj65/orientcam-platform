#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Vérifier que toutes les formations sont bien mappées aux domaines"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program
from collections import defaultdict

def get_domain(name, dept):
    """Réplique la logique TypeScript de getProgramDomain"""
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

    print("\n[VERIFICATION DU MAPPING DES DOMAINES]")
    print("="*80)

    all_programs = db.query(Program).order_by(Program.department, Program.name).all()

    # Vérifier chaque formation
    by_domain = defaultdict(list)

    for p in all_programs:
        domain = get_domain(p.name, p.department)
        by_domain[domain].append(p.name)

    # Afficher les résultats
    print(f"\nTotal: {len(all_programs)} formations\n")

    for domain in sorted(by_domain.keys(), key=lambda x: -len(by_domain[x])):
        print(f"\n{domain}: {len(by_domain[domain])} formations")
        for name in sorted(by_domain[domain])[:3]:  # Afficher les 3 premières
            print(f"  - {name[:70]}")
        if len(by_domain[domain]) > 3:
            print(f"  ... et {len(by_domain[domain]) - 3} autres")

    print(f"\n{'='*80}")
    print("\n[ORDRE RECOMMANDE POUR LE FRONTEND]")
    print(f"\n{'='*80}\n")

    domains_ordered = [
        "Sciences de l'Éducation",
        "Sciences et Technologies",
        "Géosciences et Environnement",
        "Droit et Sciences Politiques",
        "Lettres et Langues",
        "Économie et Gestion",
        "Sciences de la Vie et Santé"
    ]

    for domain in domains_ordered:
        count = len(by_domain[domain])
        print(f"  '{domain}',  // {count} formations")

    db.close()

if __name__ == "__main__":
    main()
