"""Debug script to test sorting logic"""
from app.core.database import SessionLocal
from app.models.program import Program

db = SessionLocal()

try:
    # Get all active programs
    programs = db.query(Program).filter(Program.is_active == True).all()

    print(f"\nTotal programs: {len(programs)}")
    print("\nBy level:")
    for level in ["Licence", "Master", "Ingenieur"]:
        count = len([p for p in programs if p.level == level])
        print(f"  {level}: {count}")

    # Test sorting
    def sort_key(prog):
        level_priority = {
            "Licence": 1,
            "Master": 2,
            "Ingenieur": 3
        }
        return (
            level_priority.get(prog.level, 4),
            -(prog.employment_rate or 0),
            prog.name
        )

    sorted_programs = sorted(programs, key=sort_key)

    print("\n\nPremiers 10 programmes apres tri:")
    print("=" * 80)
    for i, prog in enumerate(sorted_programs[:10], 1):
        print(f"{i:2}. Niveau: {prog.level:10} | Emploi: {prog.employment_rate:3}% | {prog.name}")

    print("\n\nDerniers 5 programmes apres tri:")
    print("=" * 80)
    for i, prog in enumerate(sorted_programs[-5:], len(sorted_programs)-4):
        print(f"{i:2}. Niveau: {prog.level:10} | Emploi: {prog.employment_rate:3}% | {prog.name}")

finally:
    db.close()
