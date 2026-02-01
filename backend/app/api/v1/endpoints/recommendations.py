"""
Recommendations endpoints
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.core.deps import get_current_student
from app.models.user import User
from app.models.student_profile import StudentProfile
from app.models.recommendation import Recommendation
from app.models.program import Program
from app.models.riasec_test import RiasecTest
from app.models.professional_value import ProfessionalValue
from app.schemas.recommendation import (
    RecommendationResponse,
    RecommendationWithDetails,
    GenerateRecommendationsRequest
)
from app.schemas.program import ProgramListItem

# Import compatibility calculation functions from programs endpoint
from app.api.v1.endpoints.programs import (
    calculate_riasec_compatibility,
    calculate_grades_compatibility,
    calculate_values_compatibility
)

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("", response_model=List[RecommendationWithDetails])
async def get_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_student)
):
    """
    Get all recommendations for the current student

    Returns recommendations sorted by total score (best first)
    """
    # Get student profile
    student_profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not student_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )

    # Get recommendations with program details
    recommendations = db.query(Recommendation).filter(
        Recommendation.student_id == student_profile.id
    ).order_by(desc(Recommendation.total_score)).all()

    # Build response with program details
    result = []
    for rec in recommendations:
        # Get program details
        program = db.query(Program).filter(Program.id == rec.program_id).first()

        if not program:
            continue

        # Load associated master program if exists
        master_program_data = None
        if program.master_program_id:
            master_program = db.query(Program).filter(Program.id == program.master_program_id).first()
            if master_program:
                from app.schemas.program import MasterProgramBrief
                master_program_data = MasterProgramBrief(
                    id=master_program.id,
                    code=master_program.code,
                    name=master_program.name,
                    duration_years=master_program.duration_years
                )

        # Convert to response format
        rec_data = {
            "id": rec.id,
            "student_profile_id": rec.student_id,
            "program_id": rec.program_id,
            "ranking": rec.ranking,
            "total_score": rec.total_score,
            "riasec_score": rec.riasec_score,
            "grades_score": rec.grades_score,
            "values_score": rec.values_score,
            "employment_score": rec.employment_score,
            "financial_score": rec.financial_score,
            "strengths": rec.strengths if rec.strengths else [],
            "weaknesses": rec.weaknesses if rec.weaknesses else [],
            "advice": rec.advice if rec.advice else "",
            "created_at": rec.created_at.isoformat(),
            "compatibility_score": rec.total_score,
            "recommendations": rec.strengths if rec.strengths else [],
            "program": ProgramListItem(
                id=program.id,
                code=program.code,
                name=program.name,
                university=program.university,
                level=program.level,
                domain=program.domain,
                duration_years=program.duration_years,
                department=program.department,
                riasec_match=program.riasec_match,
                registration_fee=program.registration_fee,
                annual_tuition=program.annual_tuition,
                employment_rate=program.employment_rate,
                capacity=program.capacity,
                is_active=program.is_active,
                master_program_id=program.master_program_id,
                master_program=master_program_data
            )
        }

        result.append(RecommendationWithDetails(**rec_data))

    return result


@router.post("/generate", response_model=List[RecommendationWithDetails])
async def generate_recommendations(
    request: GenerateRecommendationsRequest = GenerateRecommendationsRequest(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_student)
):
    """
    Generate new recommendations for the current student

    This endpoint will be implemented with the recommendation algorithm
    For now, it returns existing recommendations
    """
    # Get student profile
    student_profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not student_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )

    # Get RIASEC test results
    riasec_test = db.query(RiasecTest).filter(
        RiasecTest.student_id == student_profile.id
    ).first()

    if not riasec_test:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous devez compléter le test RIASEC avant de générer des recommandations"
        )

    # Check if professional values exist
    values = db.query(ProfessionalValue).filter(
        ProfessionalValue.student_id == student_profile.id
    ).first()

    if not values:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous devez compléter vos valeurs professionnelles avant de générer des recommandations"
        )

    # Delete existing recommendations for this student
    db.query(Recommendation).filter(
        Recommendation.student_id == student_profile.id
    ).delete()
    db.commit()

    # Get all active programs - filter by level based on user type
    programs_query = db.query(Program).filter(Program.is_active == True)

    # For new bachelor students, recommend Licence and Ingenieur programs
    # They will see the associated Master as a continuation option for Licence
    if student_profile.user_type == "new_bachelor":
        programs_query = programs_query.filter(Program.level.in_(["Licence", "Ingenieur"]))

    programs = programs_query.all()

    if not programs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aucun programme disponible"
        )

    # Calculate compatibility scores for each program
    program_scores = []

    for program in programs:
        # Calculate individual scores
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

        # Calculate employment score (0-100 based on employment_rate)
        employment_score = int(program.employment_rate) if program.employment_rate else 50

        # Calculate financial score based on tuition vs student budget
        financial_score = 50  # Default neutral
        if student_profile.max_annual_budget and program.annual_tuition:
            try:
                max_budget = student_profile.max_annual_budget

                if program.annual_tuition <= max_budget * 0.7:
                    financial_score = 100  # Well within budget
                elif program.annual_tuition <= max_budget:
                    financial_score = 80  # Within budget
                elif program.annual_tuition <= max_budget * 1.2:
                    financial_score = 60  # Slightly over budget
                else:
                    financial_score = 30  # Significantly over budget
            except:
                financial_score = 50

        # Calculate total score (weighted average)
        total_score = int(
            riasec_score * 0.30 +      # 30% RIASEC compatibility
            grades_score * 0.30 +       # 30% Academic performance
            values_score * 0.20 +       # 20% Values alignment
            employment_score * 0.15 +   # 15% Employment prospects
            financial_score * 0.05      # 5% Financial feasibility
        )

        # Generate strengths, weaknesses, and advice
        strengths = []
        weaknesses = []

        if riasec_score >= 70:
            strengths.append(f"Excellente compatibilité de personnalité ({riasec_score}%)")
        elif riasec_score >= 50:
            strengths.append(f"Bonne compatibilité de personnalité ({riasec_score}%)")
        else:
            weaknesses.append(f"Compatibilité de personnalité limitée ({riasec_score}%)")

        if grades_score >= 70:
            strengths.append(f"Votre profil académique est très adapté ({grades_score}%)")
        elif grades_score >= 50:
            strengths.append(f"Votre profil académique est adapté ({grades_score}%)")
        else:
            weaknesses.append(f"Votre profil académique pourrait nécessiter un effort supplémentaire ({grades_score}%)")

        if values_score >= 70:
            strengths.append(f"Alignement fort avec vos valeurs professionnelles ({values_score}%)")
        elif values_score < 50:
            weaknesses.append(f"Alignement limité avec vos valeurs professionnelles ({values_score}%)")

        if employment_score >= 70:
            strengths.append(f"Excellent taux d'insertion professionnelle ({employment_score}%)")
        elif employment_score < 50:
            weaknesses.append(f"Taux d'insertion professionnelle à considérer ({employment_score}%)")

        if financial_score >= 80:
            strengths.append("Les frais sont bien adaptés à votre budget")
        elif financial_score < 50:
            weaknesses.append("Les frais dépassent votre budget prévu")

        # Generate advice
        advice = ""
        if total_score >= 75:
            advice = "Cette formation est fortement recommandée pour votre profil. Elle correspond bien à vos aspirations et capacités."
        elif total_score >= 60:
            advice = "Cette formation est recommandée pour votre profil. Assurez-vous de bien comprendre les exigences."
        elif total_score >= 45:
            advice = "Cette formation pourrait vous convenir, mais nécessite une attention particulière aux domaines moins compatibles."
        else:
            advice = "Cette formation présente des défis importants par rapport à votre profil. Explorez d'autres options mieux adaptées."

        program_scores.append({
            "program": program,
            "total_score": total_score,
            "riasec_score": riasec_score,
            "grades_score": grades_score,
            "values_score": values_score,
            "employment_score": employment_score,
            "financial_score": financial_score,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "advice": advice
        })

    # Sort by total score (best first)
    program_scores.sort(key=lambda x: x["total_score"], reverse=True)

    # Create recommendations for top programs (limit to request.limit or 20)
    recommendations_to_create = program_scores[:min(request.limit, 20)]

    created_recommendations = []
    for idx, score_data in enumerate(recommendations_to_create, start=1):
        recommendation = Recommendation(
            student_id=student_profile.id,
            program_id=score_data["program"].id,
            ranking=idx,
            total_score=score_data["total_score"],
            riasec_score=score_data["riasec_score"],
            grades_score=score_data["grades_score"],
            values_score=score_data["values_score"],
            employment_score=score_data["employment_score"],
            financial_score=score_data["financial_score"],
            strengths=score_data["strengths"],
            weaknesses=score_data["weaknesses"],
            advice=score_data["advice"],
            algorithm_version="1.0"
        )
        db.add(recommendation)
        created_recommendations.append(recommendation)

    db.commit()

    # Refresh to get IDs and relationships
    for rec in created_recommendations:
        db.refresh(rec)

    # Get recommendations with program details
    recommendations = db.query(Recommendation).filter(
        Recommendation.student_id == student_profile.id
    ).order_by(desc(Recommendation.total_score)).limit(request.limit).all()

    # Build response with program details
    result = []
    for rec in recommendations:
        # Get program details
        program = db.query(Program).filter(Program.id == rec.program_id).first()

        if not program:
            continue

        # Load associated master program if exists
        master_program_data = None
        if program.master_program_id:
            master_program = db.query(Program).filter(Program.id == program.master_program_id).first()
            if master_program:
                from app.schemas.program import MasterProgramBrief
                master_program_data = MasterProgramBrief(
                    id=master_program.id,
                    code=master_program.code,
                    name=master_program.name,
                    duration_years=master_program.duration_years
                )

        # Convert to response format
        rec_data = {
            "id": rec.id,
            "student_profile_id": rec.student_id,
            "program_id": rec.program_id,
            "ranking": rec.ranking,
            "total_score": rec.total_score,
            "riasec_score": rec.riasec_score,
            "grades_score": rec.grades_score,
            "values_score": rec.values_score,
            "employment_score": rec.employment_score,
            "financial_score": rec.financial_score,
            "strengths": rec.strengths if rec.strengths else [],
            "weaknesses": rec.weaknesses if rec.weaknesses else [],
            "advice": rec.advice if rec.advice else "",
            "created_at": rec.created_at.isoformat(),
            "compatibility_score": rec.total_score,
            "recommendations": rec.strengths if rec.strengths else [],
            "program": ProgramListItem(
                id=program.id,
                code=program.code,
                name=program.name,
                university=program.university,
                level=program.level,
                domain=program.domain,
                duration_years=program.duration_years,
                department=program.department,
                riasec_match=program.riasec_match,
                registration_fee=program.registration_fee,
                annual_tuition=program.annual_tuition,
                employment_rate=program.employment_rate,
                capacity=program.capacity,
                is_active=program.is_active,
                master_program_id=program.master_program_id,
                master_program=master_program_data
            )
        }

        result.append(RecommendationWithDetails(**rec_data))

    return result


@router.get("/{recommendation_id}", response_model=RecommendationResponse)
async def get_recommendation_detail(
    recommendation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_student)
):
    """
    Get details of a specific recommendation
    """
    # Get student profile
    student_profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not student_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )

    # Get recommendation
    recommendation = db.query(Recommendation).filter(
        Recommendation.id == recommendation_id,
        Recommendation.student_id == student_profile.id
    ).first()

    if not recommendation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recommendation not found"
        )

    return RecommendationResponse(
        id=recommendation.id,
        student_profile_id=recommendation.student_id,
        program_id=recommendation.program_id,
        ranking=recommendation.ranking,
        total_score=recommendation.total_score,
        riasec_score=recommendation.riasec_score,
        grades_score=recommendation.grades_score,
        values_score=recommendation.values_score,
        employment_score=recommendation.employment_score,
        financial_score=recommendation.financial_score,
        strengths=recommendation.strengths if recommendation.strengths else [],
        weaknesses=recommendation.weaknesses if recommendation.weaknesses else [],
        advice=recommendation.advice if recommendation.advice else "",
        created_at=recommendation.created_at.isoformat()
    )
