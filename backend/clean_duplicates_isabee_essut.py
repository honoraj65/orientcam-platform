#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Nettoyer les doublons et formations incorrectes ISABEE/ESSUT"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.program import Program

def main():
    db = SessionLocal()

    print("\n[NETTOYAGE ISABEE ET ESSUT]")
    print("="*80)

    # 1. Supprimer les 3 formations Ingénieur d'ISABEE (ne devraient pas exister)
    print("\n1. ISABEE - Suppression formations Ingénieur incorrectes")
    isabee_ing = db.query(Program).filter(
        Program.department == "Institut Superieur d'Agriculture, du Bois, de l'eau, et de l'environnement",
        Program.level == "Ingenieur"
    ).all()

    print(f"   Trouvé: {len(isabee_ing)} formations Ingénieur à supprimer")
    for p in isabee_ing:
        print(f"   [DELETE] {p.name}")
        db.delete(p)

    # 2. Supprimer les doublons ESSUT
    print(f"\n2. ESSUT - Suppression doublons")

    # Trouver tous les programmes ESSUT
    essut_all = db.query(Program).filter(
        Program.department == "Ecole Superieure des Sciences de l'Urbanisme et du Tourisme"
    ).order_by(Program.code, Program.id).all()

    # Garder seulement le premier de chaque code
    seen_codes = set()
    deleted = 0
    for p in essut_all:
        if p.code in seen_codes:
            print(f"   [DELETE DOUBLON] {p.name} (code: {p.code})")
            db.delete(p)
            deleted += 1
        else:
            seen_codes.add(p.code)
            print(f"   [KEEP] {p.name} (code: {p.code})")

    db.commit()

    print(f"\n{'='*80}")
    print("[VERIFICATION APRES NETTOYAGE]")

    # ISABEE
    isabee_count = db.query(Program).filter(
        Program.department == "Institut Superieur d'Agriculture, du Bois, de l'eau, et de l'environnement"
    ).count()
    print(f"\nISABEE: {isabee_count} formations (attendu: 6)")

    isabee_final = db.query(Program).filter(
        Program.department == "Institut Superieur d'Agriculture, du Bois, de l'eau, et de l'environnement"
    ).order_by(Program.level, Program.name).all()
    for p in isabee_final:
        print(f"  [{p.level:9}] {p.name:50} {p.duration_years} ans")

    # ESSUT
    essut_count = db.query(Program).filter(
        Program.department == "Ecole Superieure des Sciences de l'Urbanisme et du Tourisme"
    ).count()
    print(f"\nESSUT: {essut_count} formations (attendu: 4)")

    essut_final = db.query(Program).filter(
        Program.department == "Ecole Superieure des Sciences de l'Urbanisme et du Tourisme"
    ).order_by(Program.level, Program.name).all()
    for p in essut_final:
        print(f"  [{p.level:9}] {p.name:50} {p.duration_years} ans")

    # Total
    total = db.query(Program).count()
    print(f"\n[TOTAL GENERAL]: {total} formations")

    db.close()

if __name__ == "__main__":
    main()
