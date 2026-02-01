"""
Student profile endpoints
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.database import get_db
from app.core.deps import get_current_student
from app.models.user import User
from app.models.student_profile import StudentProfile
from app.models.academic_grade import AcademicGrade
from app.models.professional_value import ProfessionalValue
from app.schemas.student import (
    StudentProfileUpdate, StudentProfileResponse,
    GradeCreate, GradeUpdate, GradeResponse,
    ValuesCreate, ValuesUpdate, ValuesResponse
)
from app.schemas.auth import MessageResponse

router = APIRouter(prefix="/student", tags=["Student Profile"])


def calculate_completion_percentage(profile: StudentProfile, db: Session) -> int:
    """Calculate profile completion percentage based on user type

    Each section counts for 25% of the total:
    - Basic info: 25%
    - User type specific fields: 25%
    - Academic grades: 25%
    - Professional values: 25%
    """
    percentage = 0
    print(f"\n=== DEBUG: Calculating completion for profile {profile.id} ===")
    print(f"User type: {profile.user_type}")

    # Basic info (25%)
    basic_fields = [
        profile.first_name, profile.last_name, profile.phone,
        profile.gender, profile.date_of_birth, profile.city, profile.region
    ]
    basic_completed = sum(1 for field in basic_fields if field)
    basic_percentage = (basic_completed / len(basic_fields)) * 25
    percentage += basic_percentage
    print(f"Basic info: {basic_completed}/{len(basic_fields)} fields = {basic_percentage:.1f}%")

    # User type specific fields (25%)
    if profile.user_type == 'university_student':
        # University students: establishment, department, level are REQUIRED
        university_fields = [
            profile.university_establishment,
            profile.university_department,
            profile.university_level
        ]
        type_completed = sum(1 for field in university_fields if field and field.strip())
        type_percentage = (type_completed / len(university_fields)) * 25
        print(f"University fields: {type_completed}/{len(university_fields)} fields = {type_percentage:.1f}%")
        print(f"  - establishment: {profile.university_establishment}")
        print(f"  - department: {profile.university_department}")
        print(f"  - level: {profile.university_level}")
    else:  # new_bachelor
        # New bachelors: bac_series and current_education_level are REQUIRED
        bachelor_fields = [
            profile.bac_series,
            profile.current_education_level
        ]
        type_completed = sum(1 for field in bachelor_fields if field and field.strip())
        type_percentage = (type_completed / len(bachelor_fields)) * 25
        print(f"Bachelor fields: {type_completed}/{len(bachelor_fields)} fields = {type_percentage:.1f}%")
        print(f"  - bac_series: {profile.bac_series}")
        print(f"  - current_education_level: {profile.current_education_level}")
    percentage += type_percentage

    # Academic grades (25%)
    grades_count = db.query(AcademicGrade).filter(
        AcademicGrade.student_id == profile.id
    ).count()
    grades_percentage = 25 if grades_count >= 1 else 0
    percentage += grades_percentage
    print(f"Academic grades: {grades_count} grades = {grades_percentage}%")

    # Professional values (25%)
    values = db.query(ProfessionalValue).filter(
        ProfessionalValue.student_id == profile.id
    ).first()
    values_percentage = 25 if values else 0
    percentage += values_percentage
    print(f"Professional values: {'exists' if values else 'none'} = {values_percentage}%")

    final_percentage = int(percentage)
    print(f"TOTAL: {final_percentage}%")
    print(f"=== END DEBUG ===\n")

    return final_percentage


@router.get("/profile", response_model=StudentProfileResponse)
async def get_profile(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Get current student's profile

    Requires authentication
    """
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    # Always recalculate completion percentage on GET to ensure it's up to date
    print(f"\n>>> GET /profile called for user {current_user.id}")
    print(f">>> Current stored percentage: {profile.completion_percentage}%")
    new_percentage = calculate_completion_percentage(profile, db)
    print(f">>> Calculated new percentage: {new_percentage}%")
    if profile.completion_percentage != new_percentage:
        print(f">>> Updating percentage from {profile.completion_percentage}% to {new_percentage}%")
        profile.completion_percentage = new_percentage
        db.commit()
        db.refresh(profile)
        print(f">>> Database updated successfully")
    else:
        print(f">>> No update needed, percentage unchanged")

    return profile


@router.put("/profile", response_model=StudentProfileResponse)
async def update_profile(
    profile_data: StudentProfileUpdate,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Update current student's profile

    All fields are optional. Only provided fields will be updated.
    Profile completion percentage is automatically calculated.
    """
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    # Update fields
    update_data = profile_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    profile.updated_at = datetime.utcnow()

    # Note: Completion percentage will be recalculated on next GET /profile

    db.commit()
    db.refresh(profile)

    return profile


# Academic Grades Endpoints

@router.get("/grades", response_model=List[GradeResponse])
async def get_grades(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Get all academic grades for current student

    Returns list of grades sorted by academic year and term
    """
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    grades = db.query(AcademicGrade).filter(
        AcademicGrade.student_id == profile.id
    ).order_by(
        AcademicGrade.academic_year.desc(),
        AcademicGrade.term
    ).all()

    return grades


@router.post("/grades", response_model=GradeResponse, status_code=status.HTTP_201_CREATED)
async def create_grade(
    grade_data: GradeCreate,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Create a new academic grade

    - **subject**: Subject name (e.g., "Mathématiques")
    - **grade**: Grade value (0-20)
    - **coefficient**: Subject coefficient (1-10)
    - **academic_year**: Academic year (e.g., "2023-2024")
    - **term**: Term name (e.g., "Trimestre 1")
    """
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    # Create grade
    grade = AcademicGrade(
        student_id=profile.id,
        subject=grade_data.subject,
        grade=grade_data.grade,
        coefficient=grade_data.coefficient,
        academic_year=grade_data.academic_year,
        term=grade_data.term
    )

    db.add(grade)
    db.commit()
    db.refresh(grade)

    return grade


@router.put("/grades/{grade_id}", response_model=GradeResponse)
async def update_grade(
    grade_id: str,
    grade_data: GradeUpdate,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Update an existing academic grade

    All fields are optional. Only provided fields will be updated.
    """
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    # Get grade
    grade = db.query(AcademicGrade).filter(
        AcademicGrade.id == grade_id,
        AcademicGrade.student_id == profile.id
    ).first()

    if not grade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grade not found"
        )

    # Update fields
    update_data = grade_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(grade, field, value)

    grade.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(grade)

    return grade


@router.delete("/grades/{grade_id}", response_model=MessageResponse)
async def delete_grade(
    grade_id: str,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Delete an academic grade
    """
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    # Get grade
    grade = db.query(AcademicGrade).filter(
        AcademicGrade.id == grade_id,
        AcademicGrade.student_id == profile.id
    ).first()

    if not grade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grade not found"
        )

    db.delete(grade)
    db.commit()

    return MessageResponse(message="Grade deleted successfully")


# Professional Values Endpoints

@router.get("/values", response_model=ValuesResponse)
async def get_values(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Get professional values for current student

    Returns the professional values assessment (if exists)
    """
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    values = db.query(ProfessionalValue).filter(
        ProfessionalValue.student_id == profile.id
    ).first()

    if not values:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Professional values not found. Please create them first."
        )

    return values


@router.post("/values", response_model=ValuesResponse, status_code=status.HTTP_201_CREATED)
async def create_values(
    values_data: ValuesCreate,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Create professional values assessment

    Each value is rated from 1 (not important) to 5 (very important):
    - **autonomy**: Independence and self-direction
    - **creativity**: Innovation and originality
    - **helping_others**: Service and support to others
    - **job_security**: Stability and employment security
    - **salary**: Financial compensation
    - **work_life_balance**: Time for personal life
    - **prestige**: Social recognition and status
    - **variety**: Diversity of tasks and activities
    """
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    # Check if values already exist
    existing_values = db.query(ProfessionalValue).filter(
        ProfessionalValue.student_id == profile.id
    ).first()

    if existing_values:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Professional values already exist. Use PUT to update."
        )

    # Create values
    values = ProfessionalValue(
        student_id=profile.id,
        autonomy=values_data.autonomy,
        creativity=values_data.creativity,
        helping_others=values_data.helping_others,
        job_security=values_data.job_security,
        salary=values_data.salary,
        work_life_balance=values_data.work_life_balance,
        prestige=values_data.prestige,
        variety=values_data.variety
    )

    db.add(values)
    db.commit()
    db.refresh(values)

    # Note: Profile completion percentage will be recalculated on next GET /profile

    return values


@router.put("/values", response_model=ValuesResponse)
async def update_values(
    values_data: ValuesUpdate,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Update professional values assessment

    All fields are optional. Only provided fields will be updated.
    """
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    # Get values
    values = db.query(ProfessionalValue).filter(
        ProfessionalValue.student_id == profile.id
    ).first()

    if not values:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Professional values not found. Use POST to create."
        )

    # Update fields
    update_data = values_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(values, field, value)

    values.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(values)

    # Note: Profile completion percentage will be recalculated on next GET /profile

    return values


@router.delete("/values", response_model=MessageResponse)
async def delete_values(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Delete professional values assessment
    """
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    values = db.query(ProfessionalValue).filter(
        ProfessionalValue.student_id == profile.id
    ).first()

    if not values:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Professional values not found"
        )

    db.delete(values)
    db.commit()

    return MessageResponse(message="Professional values deleted successfully")
