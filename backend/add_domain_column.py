#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Ajouter la colonne domain à la table programs"""

import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'orientcam.db')

print("\n[AJOUT COLONNE DOMAIN]")
print("="*80)
print(f"Database: {db_path}\n")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # Vérifier si la colonne existe déjà
    cursor.execute("PRAGMA table_info(programs)")
    columns = [row[1] for row in cursor.fetchall()]
    
    if 'domain' in columns:
        print("[OK] La colonne 'domain' existe déjà")
    else:
        print("[ADD] Ajout de la colonne 'domain'...")
        cursor.execute("ALTER TABLE programs ADD COLUMN domain VARCHAR(100)")
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_programs_domain ON programs (domain)")
        conn.commit()
        print("[OK] Colonne 'domain' ajoutée avec succès")
    
    print("\n" + "="*80)
    
except Exception as e:
    print(f"[ERROR] {e}")
    conn.rollback()
    
finally:
    conn.close()
