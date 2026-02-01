"""Fix incorrect Licence-Master link for Sciences Biomedicales"""
import sys
sys.path.insert(0, 'C:\\Users\\GBK TECH\\backend')

from app.core.database import SessionLocal
from app.models.program import Program

db = SessionLocal()

try:
    # Find the Licence en Sciences Biomedicales
    biomed_licence = db.query(Program).filter(
        Program.code == "FS-BIOMED-L3"
    ).first()

    if not biomed_licence:
        print("[ERROR] Licence en Sciences Biomedicales not found")
        sys.exit(1)

    print(f"[INFO] Found: {biomed_licence.name}")
    print(f"  Current master_program_id: {biomed_licence.master_program_id}")

    if biomed_licence.master_program_id:
        master = db.query(Program).filter(
            Program.id == biomed_licence.master_program_id
        ).first()
        if master:
            print(f"  Currently linked to: {master.name} (INCORRECT)")

    # Remove the incorrect master link
    biomed_licence.master_program_id = None
    db.commit()

    print(f"\n[OK] Removed incorrect master link")
    print(f"  The Licence en Sciences Biomedicales will now display without a Master continuation")

finally:
    db.close()
