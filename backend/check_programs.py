#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Script to check programs in database"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.program import Program
from collections import Counter

def main():
    db = SessionLocal()
    try:
        programs = db.query(Program).all()
        print(f'Total programmes: {len(programs)}')

        print(f'\nPar universite:')
        unis = Counter([p.university or 'Non specifiee' for p in programs])
        for uni, count in sorted(unis.items()):
            print(f'  {uni}: {count}')

        print(f'\nPar niveau:')
        levels = Counter([p.level for p in programs])
        for level, count in sorted(levels.items()):
            print(f'  {level}: {count}')

        print(f'\nListe detaillee:')
        for p in sorted(programs, key=lambda x: (x.university or '', x.level, x.name)):
            print(f'  [{p.level}] {p.name} - {p.university or "Non specifiee"}')

    finally:
        db.close()

if __name__ == "__main__":
    main()
