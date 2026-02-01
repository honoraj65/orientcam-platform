"""Debug pagination issue"""
from app.core.database import SessionLocal
from app.models.program import Program

db = SessionLocal()

try:
    # Get all programs
    programs = db.query(Program).filter(Program.is_active == True).all()

    print(f"Total programmes recuperes: {len(programs)}")

    # Sort
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

    print(f"Total programmes tries: {len(sorted_programs)}")

    # Test pagination
    skip = 24
    limit = 12
    page3 = sorted_programs[skip:skip + limit]

    print(f"\nPage 3 (offset={skip}, limit={limit}):")
    print(f"  Attendu: {min(limit, len(sorted_programs) - skip)} programmes")
    print(f"  Recu: {len(page3)} programmes")

    if len(page3) > 0:
        print(f"\nPremier programme page 3: {page3[0].name}")
        print(f"Dernier programme page 3: {page3[-1].name}")

    # Check for duplicates
    all_ids = [p.id for p in sorted_programs]
    unique_ids = set(all_ids)
    if len(all_ids) != len(unique_ids):
        print(f"\nATTENTION: {len(all_ids) - len(unique_ids)} doublons detectes!")
        # Find duplicates
        seen = set()
        duplicates = []
        for pid in all_ids:
            if pid in seen:
                duplicates.append(pid)
            seen.add(pid)
        print(f"IDs en double: {duplicates}")

finally:
    db.close()
