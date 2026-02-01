"""Check programs without university"""
import sys
sys.path.insert(0, 'C:\\Users\\GBK TECH\\backend')

from app.core.database import SessionLocal
from app.models.program import Program

db = SessionLocal()

try:
    # Get all programs
    all_programs = db.query(Program).all()
    print(f"Total programs: {len(all_programs)}")

    # Check programs without university
    programs_without_university = db.query(Program).filter(
        (Program.university == None) | (Program.university == '')
    ).all()

    print(f"\nPrograms without university: {len(programs_without_university)}")

    if programs_without_university:
        print("\nPrograms missing university:")
        for program in programs_without_university:
            print(f"  - {program.code}: {program.name}")

    # Update all programs to have "Université de Bertoua"
    print("\n=== Updating all programs to 'Université de Bertoua' ===")
    updated_count = db.query(Program).update(
        {Program.university: "Université de Bertoua"},
        synchronize_session=False
    )
    db.commit()
    print(f"Updated {updated_count} programs")

    # Verify
    programs_without_university = db.query(Program).filter(
        (Program.university == None) | (Program.university == '')
    ).all()
    print(f"\nPrograms without university after update: {len(programs_without_university)}")

finally:
    db.close()
