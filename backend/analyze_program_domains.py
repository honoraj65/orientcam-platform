#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Analyze programs to determine appropriate domain categories"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program
from collections import defaultdict

def categorize_program(program):
    """Determine domain based on program name and department"""
    name = program.name.lower()
    dept = program.department.lower()

    # Sciences et Technologies
    if any(keyword in name or keyword in dept for keyword in [
        'informatique', 'mathematiques', 'physique', 'chimie', 'statistiques',
        'energies renouvelables', 'genie', 'ingenieur', 'mines', 'materiaux'
    ]):
        return 'Sciences et Technologies'

    # Sciences de la Vie et Santé
    if any(keyword in name or keyword in dept for keyword in [
        'biologie', 'biomedicales', 'sante', 'vie'
    ]):
        return 'Sciences de la Vie et Santé'

    # Géosciences et Environnement
    if any(keyword in name or keyword in dept for keyword in [
        'geosciences', 'environnement', 'agriculture', 'forets', 'bois',
        'eau', 'terre', 'geographie', 'geomatique', 'urbanisme'
    ]):
        return 'Géosciences et Environnement'

    # Droit et Sciences Politiques
    if any(keyword in name or keyword in dept for keyword in [
        'droit', 'juridique', 'politique', 'law', 'judiciare', 'affaires'
    ]):
        return 'Droit et Sciences Politiques'

    # Économie et Gestion
    if any(keyword in name or keyword in dept for keyword in [
        'economie', 'gestion', 'banque', 'finance', 'comptabilite',
        'assurances', 'commerce'
    ]):
        return 'Économie et Gestion'

    # Lettres et Langues
    if any(keyword in name or keyword in dept for keyword in [
        'lettres', 'langues', 'anglais', 'francais', 'allemand', 'espagnol',
        'chinois', 'arabe', 'english', 'creative writing'
    ]):
        return 'Lettres et Langues'

    # Sciences Humaines et Sociales
    if any(keyword in name or keyword in dept for keyword in [
        'histoire', 'arts', 'culture', 'tourisme', 'hotellerie'
    ]):
        return 'Sciences Humaines et Sociales'

    # Sciences de l'Éducation
    if any(keyword in name or keyword in dept for keyword in [
        'dipes', 'dipen', 'dipco', 'education', 'enseignement', 'normale'
    ]):
        return 'Sciences de l\'Éducation'

    return 'Autre'

def main():
    db = SessionLocal()

    print("\n[ANALYSE DES DOMAINES DE FORMATION]\n")
    print("=" * 80)

    # Get all programs
    programs = db.query(Program).filter(Program.is_active == True).order_by(Program.department, Program.name).all()

    # Categorize
    domains = defaultdict(list)
    for program in programs:
        domain = categorize_program(program)
        domains[domain].append(program)

    # Display results
    print(f"\nTotal formations: {len(programs)}")
    print(f"Domaines identifies: {len(domains)}\n")

    for domain in sorted(domains.keys()):
        programs_in_domain = domains[domain]
        print(f"\n{'='*80}")
        print(f"{domain} ({len(programs_in_domain)} formations)")
        print(f"{'='*80}")

        # Group by department
        by_dept = defaultdict(list)
        for p in programs_in_domain:
            by_dept[p.department].append(p)

        for dept in sorted(by_dept.keys()):
            print(f"\n  {dept}:")
            for p in by_dept[dept]:
                print(f"    - {p.name}")

    # Suggest domain list
    print(f"\n\n{'='*80}")
    print("DOMAINES SUGGÉRÉS POUR LE FRONTEND")
    print(f"{'='*80}\n")

    suggested_domains = sorted([d for d in domains.keys() if d != 'Autre'])

    print("export const PROGRAM_DOMAINS = [")
    for domain in suggested_domains:
        count = len(domains[domain])
        print(f"  '{domain}',  // {count} formations")
    print("];")

    # Show statistics
    print(f"\n\n{'='*80}")
    print("STATISTIQUES PAR DOMAINE")
    print(f"{'='*80}\n")

    for domain in sorted(domains.keys(), key=lambda d: len(domains[d]), reverse=True):
        count = len(domains[domain])
        percentage = (count / len(programs)) * 100
        print(f"{domain:40} {count:3} formations ({percentage:5.1f}%)")

    db.close()

if __name__ == "__main__":
    main()
