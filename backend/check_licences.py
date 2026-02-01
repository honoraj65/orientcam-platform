"""Check Licence programs in database"""
import sys
sys.path.insert(0, 'C:\\Users\\GBK TECH\\backend')

from app.core.database import SessionLocal
from app.models.program import Program

db = SessionLocal()

try:
    # Get all programs
    all_programs = db.query(Program).filter(Program.is_active == True).all()
    print(f"Total active programs: {len(all_programs)}")

    # Group by level
    levels = {}
    for program in all_programs:
        level = program.level
        if level not in levels:
            levels[level] = []
        levels[level].append(program)

    print("\nPrograms by level:")
    for level, progs in sorted(levels.items()):
        print(f"  {level}: {len(progs)} programs")
        for p in progs[:3]:  # Show first 3
            print(f"    - {p.code}: {p.name}")

    # Check Licence 3 specifically
    licence3 = db.query(Program).filter(
        Program.is_active == True,
        Program.level == "Licence 3"
    ).all()
    print(f"\nLicence 3 programs: {len(licence3)}")

finally:
    db.close()
