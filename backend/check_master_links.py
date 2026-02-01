"""Check Licence-Master associations"""
import sys
sys.path.insert(0, 'C:\\Users\\GBK TECH\\backend')

from app.core.database import SessionLocal
from app.models.program import Program

db = SessionLocal()

try:
    # Get all Licence programs with master links
    licences = db.query(Program).filter(
        Program.is_active == True,
        Program.level == "Licence",
        Program.master_program_id.isnot(None)
    ).all()

    print(f"[INFO] Licences with Master links: {len(licences)}\n")

    for lic in licences:
        master = db.query(Program).filter(Program.id == lic.master_program_id).first()

        if master:
            # Check if names/domains match
            match_status = "OK" if (lic.name.lower() in master.name.lower() or
                                   master.name.lower() in lic.name.lower() or
                                   lic.domain == master.domain) else "MISMATCH"

            print(f"{'[PROBLEM]' if match_status == 'MISMATCH' else '[OK]'} {match_status}")
            print(f"  Licence: {lic.code} - {lic.name}")
            print(f"  Domain: {lic.domain}")
            print(f"  Master:  {master.code} - {master.name}")
            print(f"  Domain: {master.domain}")
            print()
        else:
            print(f"[ERROR] Licence {lic.code} points to non-existent master {lic.master_program_id}")
            print(f"  {lic.name}")
            print()

finally:
    db.close()
