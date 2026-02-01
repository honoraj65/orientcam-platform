"""Check for engineering programs in database"""
import sys
sys.path.insert(0, 'C:\\Users\\GBK TECH\\backend')

from app.core.database import SessionLocal
from app.models.program import Program

db = SessionLocal()

try:
    # Get all active programs
    all_programs = db.query(Program).filter(Program.is_active == True).all()
    print(f"Total active programs: {len(all_programs)}")

    # Check for engineering-related programs
    engineering_keywords = ['ingénieur', 'ingenieur', 'engineer', 'engineering', 'polytechnique', 'ENIS', 'ENSET', 'ENSTP']

    print("\n=== SEARCHING FOR ENGINEERING PROGRAMS ===")
    engineering_programs = []

    for program in all_programs:
        program_text = f"{program.name} {program.code} {program.department or ''} {program.domain or ''}".lower()

        if any(keyword.lower() in program_text for keyword in engineering_keywords):
            engineering_programs.append(program)
            print(f"\nFound: {program.name}")
            print(f"  Code: {program.code}")
            print(f"  Level: {program.level}")
            print(f"  Department: {program.department}")
            print(f"  Domain: {program.domain}")
            print(f"  University: {program.university}")

    print(f"\n\nTotal engineering programs found: {len(engineering_programs)}")

    # Group by department to understand structure
    print("\n=== ALL DEPARTMENTS ===")
    departments = {}
    for program in all_programs:
        dept = program.department or "Unknown"
        if dept not in departments:
            departments[dept] = []
        departments[dept].append(program)

    for dept in sorted(departments.keys()):
        print(f"\n{dept}: {len(departments[dept])} programs")
        for p in departments[dept][:2]:
            print(f"  - {p.name} ({p.level})")

    # Check domain
    print("\n=== ALL DOMAINS ===")
    domains = {}
    for program in all_programs:
        domain = program.domain or "Unknown"
        if domain not in domains:
            domains[domain] = []
        domains[domain].append(program)

    for domain in sorted(domains.keys()):
        print(f"\n{domain}: {len(domains[domain])} programs")

finally:
    db.close()
