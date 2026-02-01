"""
Programs endpoints
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

from app.core.database import get_db
from app.core.deps import get_current_student, get_optional_current_user
from app.models.user import User
from app.models.student_profile import StudentProfile
from app.models.program import Program, ProgramSubject
from app.models.riasec_test import RiasecTest
from app.models.academic_grade import AcademicGrade
from app.models.professional_value import ProfessionalValue
from app.schemas.program import (
    ProgramListItem, ProgramDetail, ProgramSearchParams,
    ProgramCompatibility, CompatibilityScore, ProgramStatistics,
    ProgramListResponse
)

router = APIRouter(prefix="/programs", tags=["Academic Programs"])


def calculate_riasec_compatibility(student_code: str, program_code: str) -> int:
    """
    Calculate RIASEC compatibility between student and program

    Returns score 0-100 based on matching positions
    """
    if not student_code or not program_code:
        return 0

    score = 0

    # Exact match on first position: 60 points
    if len(student_code) > 0 and len(program_code) > 0:
        if student_code[0] == program_code[0]:
            score += 60

    # Match on second position: 30 points
    if len(student_code) > 1 and len(program_code) > 1:
        if student_code[1] == program_code[1]:
            score += 30
        elif student_code[0] == program_code[1]:
            score += 20  # First in student matches second in program

    # Match on third position: 10 points
    if len(student_code) > 2 and len(program_code) > 2:
        if student_code[2] == program_code[2]:
            score += 10
        elif student_code[1] == program_code[2]:
            score += 5

    return min(score, 100)


def calculate_grades_compatibility(student_profile: StudentProfile, program: Program, db: Session) -> int:
    """
    Calculate academic grades compatibility

    Returns score 0-100 based on grades and required subjects
    """
    # Check bac grade
    if not student_profile.bac_grade or not program.min_bac_grade:
        return 50  # Neutral score if no data

    bac_score = 0
    if student_profile.bac_grade >= program.min_bac_grade:
        # Above minimum: scale from 50-100
        if student_profile.bac_grade >= 15:
            bac_score = 100
        elif student_profile.bac_grade >= program.min_bac_grade + 2:
            bac_score = 80
        else:
            bac_score = 60
    else:
        # Below minimum: scale from 0-49
        gap = program.min_bac_grade - student_profile.bac_grade
        bac_score = max(0, 50 - (gap * 10))

    # Check subject grades
    subject_score = 50  # Default
    if program.required_subjects:
        grades = db.query(AcademicGrade).filter(
            AcademicGrade.student_id == student_profile.id,
            AcademicGrade.subject.in_(program.required_subjects)
        ).all()

        if grades:
            avg_grade = sum(g.grade for g in grades) / len(grades)
            if avg_grade >= 15:
                subject_score = 100
            elif avg_grade >= 12:
                subject_score = 80
            elif avg_grade >= 10:
                subject_score = 60
            else:
                subject_score = 40

    # Combined score (70% bac, 30% subjects)
    return int(bac_score * 0.7 + subject_score * 0.3)


def calculate_values_compatibility(student_profile: StudentProfile, program: Program, db: Session) -> int:
    """
    Calculate professional values compatibility

    Returns score 0-100 based on values alignment
    """
    values = db.query(ProfessionalValue).filter(
        ProfessionalValue.student_id == student_profile.id
    ).first()

    if not values:
        return 50  # Neutral if no values data

    # Map RIASEC to values preferences
    # This is a simplified heuristic
    riasec_values_map = {
        "R": {"autonomy": 0.3, "job_security": 0.3, "salary": 0.2, "variety": 0.2},
        "I": {"autonomy": 0.4, "creativity": 0.3, "prestige": 0.2, "variety": 0.1},
        "A": {"creativity": 0.5, "autonomy": 0.3, "variety": 0.2},
        "S": {"helping_others": 0.5, "work_life_balance": 0.3, "job_security": 0.2},
        "E": {"prestige": 0.4, "salary": 0.3, "autonomy": 0.2, "variety": 0.1},
        "C": {"job_security": 0.4, "work_life_balance": 0.3, "salary": 0.2, "prestige": 0.1}
    }

    primary_code = program.riasec_match[0] if program.riasec_match else "R"
    value_weights = riasec_values_map.get(primary_code, {})

    # Calculate weighted score
    total_score = 0
    total_weight = 0

    for value_name, weight in value_weights.items():
        student_value = getattr(values, value_name, 3)  # Default 3/5
        # Normalize to 0-100
        normalized = (student_value - 1) / 4 * 100  # 1-5 scale to 0-100
        total_score += normalized * weight
        total_weight += weight

    return int(total_score / total_weight) if total_weight > 0 else 50


@router.get("", response_model=ProgramListResponse)
async def list_programs(
    level: Optional[str] = Query(None, description="Filter by level"),
    domain: Optional[str] = Query(None, description="Filter by domain"),
    department: Optional[str] = Query(None, description="Filter by department"),
    riasec_code: Optional[str] = Query(None, description="Filter by RIASEC code"),
    max_budget: Optional[int] = Query(None, description="Filter by max annual budget"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(50, ge=1, le=100, description="Limit results"),
    db: Session = Depends(get_db)
):
    """
    List all active academic programs with optional filters

    - **level**: Filter by level (e.g., "Licence", "Master")
    - **department**: Filter by department
    - **riasec_code**: Filter by RIASEC match (1-3 letters)
    - **max_budget**: Filter programs with annual_tuition <= max_budget
    - **skip**: Pagination offset
    - **limit**: Maximum results (1-100)
    """
    query = db.query(Program).options(joinedload(Program.master_program)).filter(Program.is_active == True)

    if level:
        query = query.filter(Program.level == level)

    if domain:
        query = query.filter(Program.domain == domain)

    if department:
        query = query.filter(Program.department.ilike(f"%{department}%"))

    if riasec_code:
        # Match programs where riasec_match starts with or contains riasec_code
        query = query.filter(Program.riasec_match.like(f"{riasec_code}%"))

    if max_budget:
        query = query.filter(Program.annual_tuition <= max_budget)

    # Get total count
    total = query.count()

    # Apply sorting with SQLAlchemy order_by (more reliable than Python sorted)
    query = query.order_by(Program.department, Program.name)

    # Apply pagination
    programs = query.offset(offset).limit(limit).all()

    # Convert to Pydantic models explicitly to ensure master_program is serialized
    program_items = [ProgramListItem.model_validate(p) for p in programs]

    return ProgramListResponse(programs=program_items, total=total)


@router.get("/search", response_model=List[ProgramListItem])
async def search_programs(
    q: str = Query(..., min_length=2, description="Search query"),
    db: Session = Depends(get_db)
):
    """
    Search programs by name, code, or description

    - **q**: Search query (minimum 2 characters)

    Searches in: program name, code, description, and department
    """
    search_term = f"%{q}%"

    programs = db.query(Program).filter(
        Program.is_active == True,
        (
            Program.name.ilike(search_term) |
            Program.code.ilike(search_term) |
            Program.description.ilike(search_term) |
            Program.department.ilike(search_term)
        )
    ).order_by(Program.name).limit(50).all()

    return programs


@router.get("/statistics", response_model=ProgramStatistics)
async def get_statistics(db: Session = Depends(get_db)):
    """
    Get program statistics

    Returns counts by level, department, and averages
    """
    programs = db.query(Program).filter(Program.is_active == True).all()

    # Count by level
    by_level = {}
    for p in programs:
        by_level[p.level] = by_level.get(p.level, 0) + 1

    # Count by department
    by_department = {}
    for p in programs:
        by_department[p.department] = by_department.get(p.department, 0) + 1

    # RIASEC distribution (first letter)
    riasec_dist = {}
    for p in programs:
        first_letter = p.riasec_match[0] if p.riasec_match else "Unknown"
        riasec_dist[first_letter] = riasec_dist.get(first_letter, 0) + 1

    # Averages
    avg_tuition = sum(p.annual_tuition for p in programs) / len(programs) if programs else 0
    programs_with_employment = [p for p in programs if p.employment_rate is not None]
    avg_employment = sum(p.employment_rate for p in programs_with_employment) / len(programs_with_employment) if programs_with_employment else 0

    return ProgramStatistics(
        total_programs=len(programs),
        by_level=by_level,
        by_department=by_department,
        average_tuition=avg_tuition,
        average_employment_rate=avg_employment,
        riasec_distribution=riasec_dist
    )


@router.get("/{program_id}", response_model=ProgramDetail)
async def get_program_detail(
    program_id: str,
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific program

    - **program_id**: Program UUID

    Returns complete program information including subjects
    """
    program = db.query(Program).filter(Program.id == program_id).first()

    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Program not found"
        )

    # Convert to dict and format datetime fields
    program_dict = {
        "id": program.id,
        "code": program.code,
        "name": program.name,
        "university": program.university,
        "level": program.level,
        "domain": program.domain,
        "duration_years": program.duration_years,
        "department": program.department,
        "description": program.description,
        "objectives": program.objectives,
        "career_prospects": program.career_prospects,
        "required_bac_series": program.required_bac_series,
        "min_bac_grade": program.min_bac_grade,
        "required_subjects": program.required_subjects,
        "riasec_match": program.riasec_match,
        "registration_fee": program.registration_fee,
        "annual_tuition": program.annual_tuition,
        "total_cost_3years": program.total_cost_3years,
        "employment_rate": program.employment_rate,
        "average_starting_salary": program.average_starting_salary,
        "capacity": program.capacity,
        "is_active": program.is_active,
        "master_program_id": program.master_program_id,
        "master_program": program.master_program,
        "subjects": program.subjects,
        "created_at": program.created_at.isoformat(),
        "updated_at": program.updated_at.isoformat()
    }

    return program_dict


@router.get("/{program_id}/compatibility", response_model=ProgramCompatibility)
async def check_program_compatibility(
    program_id: str,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Check compatibility between student profile and program

    Calculates a compatibility score based on:
    - RIASEC match (30%)
    - Academic grades (25%)
    - Professional values (20%)
    - Employment rate (15%)
    - Financial feasibility (10%)

    Returns detailed breakdown and recommendations
    """
    # Get program
    program = db.query(Program).filter(Program.id == program_id).first()
    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Program not found"
        )

    # Get student profile
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    # Get latest RIASEC test
    riasec_test = db.query(RiasecTest).filter(
        RiasecTest.student_id == profile.id
    ).order_by(RiasecTest.created_at.desc()).first()

    # Calculate scores
    scores = []
    total_score = 0

    # 1. RIASEC compatibility (30%)
    riasec_score = 50  # Default
    if riasec_test:
        riasec_score = calculate_riasec_compatibility(riasec_test.holland_code, program.riasec_match)

    riasec_weighted = riasec_score * 0.3
    total_score += riasec_weighted
    scores.append(CompatibilityScore(
        criterion="RIASEC Match",
        score=riasec_score,
        weight=0.3,
        weighted_score=riasec_weighted,
        details=f"Votre code Holland ({riasec_test.holland_code if riasec_test else 'N/A'}) vs Programme ({program.riasec_match})"
    ))

    # 2. Academic grades (25%)
    grades_score = calculate_grades_compatibility(profile, program, db)
    grades_weighted = grades_score * 0.25
    total_score += grades_weighted
    scores.append(CompatibilityScore(
        criterion="Résultats académiques",
        score=grades_score,
        weight=0.25,
        weighted_score=grades_weighted,
        details=f"Note bac: {profile.bac_grade}/20, Requis: {program.min_bac_grade}/20"
    ))

    # 3. Professional values (20%)
    values_score = calculate_values_compatibility(profile, program, db)
    values_weighted = values_score * 0.2
    total_score += values_weighted
    scores.append(CompatibilityScore(
        criterion="Valeurs professionnelles",
        score=values_score,
        weight=0.2,
        weighted_score=values_weighted,
        details="Alignement entre vos valeurs et le profil du programme"
    ))

    # 4. Employment prospects (15%)
    employment_score = program.employment_rate if program.employment_rate else 50
    employment_weighted = employment_score * 0.15
    total_score += employment_weighted
    scores.append(CompatibilityScore(
        criterion="Perspectives d'emploi",
        score=employment_score,
        weight=0.15,
        weighted_score=employment_weighted,
        details=f"Taux d'emploi: {program.employment_rate}%"
    ))

    # 5. Financial feasibility (10%)
    financial_score = 50  # Default
    if profile.max_annual_budget:
        if program.annual_tuition <= profile.max_annual_budget:
            # Affordable
            financial_score = 100
        elif program.annual_tuition <= profile.max_annual_budget * 1.2:
            # Slightly over budget
            financial_score = 70
        elif program.annual_tuition <= profile.max_annual_budget * 1.5:
            # Moderately over budget
            financial_score = 40
        else:
            # Significantly over budget
            financial_score = 20

    financial_weighted = financial_score * 0.1
    total_score += financial_weighted
    scores.append(CompatibilityScore(
        criterion="Accessibilité financière",
        score=financial_score,
        weight=0.1,
        weighted_score=financial_weighted,
        details=f"Frais annuels: {program.annual_tuition:,} FCFA, Budget: {profile.max_annual_budget:,} FCFA" if profile.max_annual_budget else f"Frais: {program.annual_tuition:,} FCFA"
    ))

    # Determine ranking
    total_score_int = int(total_score)
    if total_score_int >= 80:
        ranking = "Fortement recommandé"
    elif total_score_int >= 65:
        ranking = "Recommandé"
    elif total_score_int >= 50:
        ranking = "À considérer"
    else:
        ranking = "Non recommandé"

    # Generate strengths and weaknesses
    strengths = []
    weaknesses = []

    for score_item in scores:
        if score_item.score >= 70:
            strengths.append(f"{score_item.criterion}: {score_item.score}%")
        elif score_item.score < 50:
            weaknesses.append(f"{score_item.criterion}: {score_item.score}%")

    # Generate advice
    advice = f"Avec un score de {total_score_int}%, ce programme est {ranking.lower()}. "
    if total_score_int >= 80:
        advice += "Vos profil et intérêts correspondent très bien à ce programme. C'est un excellent choix!"
    elif total_score_int >= 65:
        advice += "Ce programme correspond bien à votre profil. Nous vous encourageons à postuler."
    elif total_score_int >= 50:
        advice += "Ce programme pourrait vous convenir, mais examinez attentivement les points faibles identifiés."
    else:
        advice += "Ce programme ne semble pas optimal pour votre profil. Considérez d'autres options mieux adaptées."

    # Create components object from individual scores
    from app.schemas.program import CompatibilityComponents
    components = CompatibilityComponents(
        riasec_score=riasec_score,
        riasec_weight=0.3,
        grades_score=grades_score,
        grades_weight=0.25,
        values_score=values_score,
        values_weight=0.2,
        employment_score=employment_score,
        employment_weight=0.15,
        financial_score=financial_score,
        financial_weight=0.1
    )

    return ProgramCompatibility(
        program_id=program.id,
        program_code=program.code,
        program_name=program.name,
        total_score=total_score_int,
        ranking=ranking,
        scores=scores,
        components=components,
        strengths=strengths if strengths else ["Aucun point fort majeur identifié"],
        weaknesses=weaknesses if weaknesses else ["Aucune faiblesse majeure identifiée"],
        advice=advice
    )
