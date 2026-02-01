#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Analyser les domaines des formations UBertoua"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program
from collections import Counter

def main():
    db = SessionLocal()

    print("\n[ANALYSE DES DOMAINES - UNIVERSITE DE BERTOUA]")
    print("="*80)

    # Récupérer toutes les formations
    all_programs = db.query(Program).order_by(Program.department, Program.name).all()

    print(f"\nTotal formations: {len(all_programs)}")
    print(f"\n{'='*80}")

    # Analyser par établissement
    by_department = {}
    for p in all_programs:
        if p.department not in by_department:
            by_department[p.department] = []
        by_department[p.department].append(p)

    # Suggestion de domaines basée sur les établissements et formations
    domain_suggestions = {
        "Sciences et Technologies": [],
        "Lettres et Langues": [],
        "Droit et Sciences Politiques": [],
        "Économie et Gestion": [],
        "Géosciences et Environnement": [],
        "Sciences de l'Éducation": [],
        "Sciences de la Vie et Santé": []
    }

    for dept_name, programs in sorted(by_department.items()):
        print(f"\n{dept_name}")
        print(f"  {len(programs)} formations\n")

        for p in programs:
            name_lower = p.name.lower()
            dept_lower = dept_name.lower()

            # Déterminer le domaine
            domain = None

            # Sciences de l'Éducation (ENS)
            if 'dipes' in name_lower or 'dipen' in name_lower or 'dipco' in name_lower or 'normale' in dept_lower:
                domain = "Sciences de l'Éducation"

            # Droit et Sciences Politiques
            elif 'droit' in name_lower or 'juridique' in dept_lower or 'politique' in name_lower:
                domain = "Droit et Sciences Politiques"

            # Lettres et Langues
            elif ('lettres' in name_lower or 'langues' in name_lower or
                  'anglais' in name_lower or 'francais' in name_lower or
                  'histoire' in name_lower or 'allemand' in name_lower or
                  'espagnol' in name_lower or 'chinois' in name_lower or
                  'arabe' in name_lower or 'creative writing' in name_lower):
                domain = "Lettres et Langues"

            # Économie et Gestion
            elif ('economie' in name_lower or 'gestion' in name_lower or
                  'banque' in name_lower or 'finance' in name_lower or
                  'comptabilite' in name_lower):
                domain = "Économie et Gestion"

            # Géosciences et Environnement
            elif ('geographie' in name_lower or 'urbanisme' in name_lower or
                  'tourisme' in name_lower or 'agriculture' in name_lower or
                  'environnement' in name_lower or 'forets' in name_lower or
                  'bois' in name_lower or 'geosciences' in name_lower or
                  'geomatique' in name_lower or 'hotellerie' in name_lower or
                  'aquaculture' in name_lower or 'elevage' in name_lower):
                domain = "Géosciences et Environnement"

            # Sciences de la Vie et Santé
            elif 'biologie' in name_lower or 'biomedicales' in name_lower:
                domain = "Sciences de la Vie et Santé"

            # Sciences et Technologies (défaut pour les autres sciences)
            elif ('informatique' in name_lower or 'mathematiques' in name_lower or
                  'physique' in name_lower or 'chimie' in name_lower or
                  'statistiques' in name_lower or 'genie' in name_lower or
                  'ingenieur' in name_lower or 'mines' in name_lower or
                  'materiaux' in name_lower or 'energies' in name_lower):
                domain = "Sciences et Technologies"

            else:
                domain = "Sciences et Technologies"  # Par défaut

            domain_suggestions[domain].append(p.name)
            print(f"  - {p.name[:60]:60} -> {domain}")

    # Résumé par domaine
    print(f"\n{'='*80}")
    print("\n[RESUME PAR DOMAINE]")
    print(f"\n{'='*80}")

    for domain, programs in sorted(domain_suggestions.items(), key=lambda x: -len(x[1])):
        if len(programs) > 0:
            print(f"\n{domain}: {len(programs)} formations")

    # Domaines recommandés
    print(f"\n{'='*80}")
    print("\n[DOMAINES RECOMMANDES POUR L'APPLICATION]")
    print(f"\n{'='*80}")

    recommended_domains = [d for d, progs in domain_suggestions.items() if len(progs) > 0]
    for i, domain in enumerate(recommended_domains, 1):
        count = len(domain_suggestions[domain])
        print(f"{i}. '{domain}',  // {count} formations")

    db.close()

if __name__ == "__main__":
    main()
