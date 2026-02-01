"""Test direct generation of recommendations with engineering schools"""
import sys
sys.path.insert(0, 'C:\\Users\\GBK TECH\\backend')

from app.core.database import SessionLocal
from app.models.student_profile import StudentProfile
from app.models.program import Program
from app.models.recommendation import Recommendation
from app.models.riasec_test import RiasecTest
from app.models.professional_value import ProfessionalValue
from sqlalchemy import desc

# Import compatibility functions
from app.api.v1.endpoints.programs import (
    calculate_riasec_compatibility,
    calculate_grades_compatibility,
    calculate_values_compatibility
)

db = SessionLocal()

try:
    # Find the test user (new_bachelor with email test@example.com or similar)
    # Get most recent student profile
    student_profile = db.query(StudentProfile).filter(
        StudentProfile.user_type == "new_bachelor"
    ).first()

    if not student_profile:
        print("[ERROR] No new_bachelor student profile found")
        sys.exit(1)

    print(f"[OK] Found student profile: {student_profile.id}")
    print(f"     User type: {student_profile.user_type}")

    # Get RIASEC test
    riasec_test = db.query(RiasecTest).filter(
        RiasecTest.student_id == student_profile.id
    ).first()

    if not riasec_test:
        print("[ERROR] No RIASEC test found for this student")
        sys.exit(1)

    print(f"[OK] RIASEC code: {riasec_test.holland_code}")

    # Get professional values
    values = db.query(ProfessionalValue).filter(
        ProfessionalValue.student_id == student_profile.id
    ).first()

    if not values:
        print("[ERROR] No professional values found")
        sys.exit(1)

    print(f"[OK] Professional values found")

    # Get all programs for new_bachelor (should include Licence AND Ingenieur)
    programs_query = db.query(Program).filter(Program.is_active == True)
    programs_query = programs_query.filter(Program.level.in_(["Licence", "Ingenieur"]))
    programs = programs_query.all()

    print(f"\n[INFO] Total programs to evaluate: {len(programs)}")

    # Count by level
    levels = {}
    for p in programs:
        levels[p.level] = levels.get(p.level, 0) + 1

    print("[INFO] Programs by level:")
    for level, count in sorted(levels.items()):
        print(f"  - {level}: {count} programs")

    # Show engineering programs
    engineering_programs = [p for p in programs if p.level == "Ingenieur"]
    print(f"\n[INFO] Engineering programs found: {len(engineering_programs)}")
    for ep in engineering_programs:
        print(f"  - {ep.code}: {ep.name}")

    # Delete existing recommendations
    deleted = db.query(Recommendation).filter(
        Recommendation.student_id == student_profile.id
    ).delete()
    db.commit()
    print(f"\n[OK] Deleted {deleted} existing recommendations")

    # Generate recommendations
    print(f"\n[INFO] Generating recommendations...")
    program_scores = []

    for program in programs:
        riasec_score = calculate_riasec_compatibility(
            riasec_test.holland_code,
            program.riasec_match
        )

        grades_score = calculate_grades_compatibility(
            student_profile,
            program,
            db
        )

        values_score = calculate_values_compatibility(
            student_profile,
            program,
            db
        )

        employment_score = int(program.employment_rate) if program.employment_rate else 50

        financial_score = 50
        if student_profile.max_annual_budget and program.annual_tuition:
            try:
                max_budget = student_profile.max_annual_budget
                if program.annual_tuition <= max_budget * 0.7:
                    financial_score = 100
                elif program.annual_tuition <= max_budget:
                    financial_score = 80
                elif program.annual_tuition <= max_budget * 1.2:
                    financial_score = 60
                else:
                    financial_score = 30
            except:
                financial_score = 50

        total_score = int(
            riasec_score * 0.30 +
            grades_score * 0.30 +
            values_score * 0.20 +
            employment_score * 0.15 +
            financial_score * 0.05
        )

        program_scores.append({
            'program': program,
            'total_score': total_score,
            'riasec_score': riasec_score,
            'grades_score': grades_score,
            'values_score': values_score,
            'employment_score': employment_score,
            'financial_score': financial_score
        })

    # Sort by score
    program_scores.sort(key=lambda x: x['total_score'], reverse=True)

    print(f"[OK] Calculated scores for {len(program_scores)} programs")

    # Show top 10 including engineering
    print(f"\n[INFO] Top 10 recommendations:")
    for i, ps in enumerate(program_scores[:10], 1):
        prog = ps['program']
        marker = "  [INGENIEUR]" if prog.level == "Ingenieur" else ""
        print(f"{i:2d}. {ps['total_score']:3d}% - {prog.code} - {prog.name}{marker}")

    # Save to database
    for i, ps in enumerate(program_scores, 1):
        strengths = []
        weaknesses = []

        if ps['riasec_score'] >= 70:
            strengths.append(f"Excellente compatibilité de personnalité ({ps['riasec_score']}%)")
        elif ps['riasec_score'] < 50:
            weaknesses.append(f"Compatibilité de personnalité limitée ({ps['riasec_score']}%)")

        if ps['grades_score'] >= 70:
            strengths.append(f"Votre profil académique est très adapté ({ps['grades_score']}%)")
        elif ps['grades_score'] < 50:
            weaknesses.append(f"Votre profil académique pourrait nécessiter un effort supplémentaire ({ps['grades_score']}%)")

        rec = Recommendation(
            student_id=student_profile.id,
            program_id=ps['program'].id,
            ranking=i,
            total_score=ps['total_score'],
            riasec_score=ps['riasec_score'],
            grades_score=ps['grades_score'],
            values_score=ps['values_score'],
            employment_score=ps['employment_score'],
            financial_score=ps['financial_score'],
            strengths=strengths,
            weaknesses=weaknesses,
            advice=""
        )
        db.add(rec)

    db.commit()
    print(f"\n[OK] Saved {len(program_scores)} recommendations to database")

    # Verify engineering schools are in recommendations
    saved_recs = db.query(Recommendation).filter(
        Recommendation.student_id == student_profile.id
    ).order_by(desc(Recommendation.total_score)).all()

    engineering_recs = [r for r in saved_recs if r.program.level == "Ingenieur"]
    print(f"\n[INFO] Engineering recommendations saved: {len(engineering_recs)}")
    for er in engineering_recs:
        print(f"  - Rank {er.ranking}: {er.total_score}% - {er.program.name}")

    print(f"\n[SUCCESS] Recommendations generated successfully!")

finally:
    db.close()
