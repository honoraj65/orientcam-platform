"""
Student profile Pydantic schemas
"""
import re
from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, field_validator, Field


class StudentProfileUpdate(BaseModel):
    """Schema for updating student profile"""
    user_type: Optional[str] = Field(None, max_length=20)
    university_establishment: Optional[str] = Field(None, max_length=50)
    university_department: Optional[str] = Field(None, max_length=100)
    university_level: Optional[str] = Field(None, max_length=50)
    first_name: Optional[str] = Field(None, min_length=2, max_length=100)
    last_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    city: Optional[str] = Field(None, max_length=100)
    region: Optional[str] = Field(None, max_length=100)
    current_education_level: Optional[str] = Field(None, max_length=50)
    bac_series: Optional[str] = Field(None, max_length=20)
    bac_year: Optional[int] = None
    bac_grade: Optional[int] = None
    max_annual_budget: Optional[int] = None  # Deprecated
    financial_situation: Optional[str] = Field(None, max_length=50)
    financial_aid_eligible: Optional[int] = Field(None, ge=0, le=1)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        """Validate phone number format"""
        if v is None:
            return v

        # Remove spaces and common separators
        cleaned = re.sub(r"[\s\-\(\)]", "", v)

        # Cameroon phone format: +237XXXXXXXXX or 6XXXXXXXX
        if not re.match(r"^(\+237)?[26]\d{8}$", cleaned):
            raise ValueError("Phone must be a valid Cameroon number (+237XXXXXXXXX or 6XXXXXXXX)")

        return v

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, v: Optional[str]) -> Optional[str]:
        """Validate gender"""
        if v is None:
            return v

        if v not in ["M", "F", "Autre"]:
            raise ValueError("Gender must be M, F, or Autre")

        return v

    @field_validator("date_of_birth")
    @classmethod
    def validate_age(cls, v: Optional[date]) -> Optional[date]:
        """Validate age (must be between 15 and 100)"""
        if v is None:
            return v

        from datetime import datetime
        today = datetime.now().date()
        age = (today - v).days / 365.25

        if age < 15 or age > 100:
            raise ValueError("Age must be between 15 and 100 years")

        return v

    @field_validator("bac_grade")
    @classmethod
    def validate_bac_grade(cls, v: Optional[int]) -> Optional[int]:
        """Validate bac grade (0-20)"""
        if v is None:
            return v

        if v < 0 or v > 20:
            raise ValueError("Bac grade must be between 0 and 20")

        return v

    @field_validator("bac_year")
    @classmethod
    def validate_bac_year(cls, v: Optional[int]) -> Optional[int]:
        """Validate bac year"""
        if v is None:
            return v

        from datetime import datetime
        current_year = datetime.now().year

        if v < 1950 or v > current_year + 1:
            raise ValueError(f"Bac year must be between 1950 and {current_year + 1}")

        return v

    @field_validator("user_type")
    @classmethod
    def validate_user_type(cls, v: Optional[str]) -> Optional[str]:
        """Validate user type"""
        if v is None:
            return v

        if v not in ["new_bachelor", "university_student"]:
            raise ValueError("User type must be 'new_bachelor' or 'university_student'")

        return v


class StudentProfileResponse(BaseModel):
    """Schema for student profile response"""
    id: str
    user_id: str
    user_type: Optional[str] = "new_bachelor"
    university_establishment: Optional[str] = None
    university_department: Optional[str] = None
    university_level: Optional[str] = None
    first_name: str
    last_name: str
    phone: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    city: Optional[str] = None
    region: Optional[str] = None
    current_education_level: Optional[str] = None
    bac_series: Optional[str] = None
    bac_year: Optional[int] = None
    bac_grade: Optional[int] = None
    max_annual_budget: Optional[int] = None  # Deprecated
    financial_situation: Optional[str] = None
    financial_aid_eligible: Optional[int] = None
    completion_percentage: int

    class Config:
        from_attributes = True


class GradeCreate(BaseModel):
    """Schema for creating an academic grade"""
    subject: str = Field(..., min_length=2, max_length=100)
    grade: int = Field(..., ge=0, le=20)
    coefficient: int = Field(1, ge=1, le=10)
    academic_year: str = Field(..., pattern=r"^\d{4}-\d{4}$")
    term: str = Field(..., max_length=20)

    @field_validator("academic_year")
    @classmethod
    def validate_academic_year(cls, v: str) -> str:
        """Validate academic year format (e.g., 2023-2024)"""
        parts = v.split("-")
        if len(parts) != 2:
            raise ValueError("Academic year must be in format YYYY-YYYY")

        try:
            year1 = int(parts[0])
            year2 = int(parts[1])

            if year2 != year1 + 1:
                raise ValueError("Academic year must be consecutive years (e.g., 2023-2024)")

            from datetime import datetime
            current_year = datetime.now().year

            if year1 < 2000 or year1 > current_year + 1:
                raise ValueError(f"Academic year must be between 2000 and {current_year + 1}")

        except ValueError as e:
            raise ValueError(f"Invalid academic year: {str(e)}")

        return v


class GradeUpdate(BaseModel):
    """Schema for updating an academic grade"""
    subject: Optional[str] = Field(None, min_length=2, max_length=100)
    grade: Optional[int] = Field(None, ge=0, le=20)
    coefficient: Optional[int] = Field(None, ge=1, le=10)
    academic_year: Optional[str] = Field(None, pattern=r"^\d{4}-\d{4}$")
    term: Optional[str] = Field(None, max_length=20)


class GradeResponse(BaseModel):
    """Schema for academic grade response"""
    id: str
    student_id: str
    subject: str
    grade: int
    coefficient: int
    academic_year: str
    term: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ValuesCreate(BaseModel):
    """Schema for creating professional values"""
    autonomy: int = Field(..., ge=1, le=5)
    creativity: int = Field(..., ge=1, le=5)
    helping_others: int = Field(..., ge=1, le=5)
    job_security: int = Field(..., ge=1, le=5)
    salary: int = Field(..., ge=1, le=5)
    work_life_balance: int = Field(..., ge=1, le=5)
    prestige: int = Field(..., ge=1, le=5)
    variety: int = Field(..., ge=1, le=5)


class ValuesUpdate(BaseModel):
    """Schema for updating professional values"""
    autonomy: Optional[int] = Field(None, ge=1, le=5)
    creativity: Optional[int] = Field(None, ge=1, le=5)
    helping_others: Optional[int] = Field(None, ge=1, le=5)
    job_security: Optional[int] = Field(None, ge=1, le=5)
    salary: Optional[int] = Field(None, ge=1, le=5)
    work_life_balance: Optional[int] = Field(None, ge=1, le=5)
    prestige: Optional[int] = Field(None, ge=1, le=5)
    variety: Optional[int] = Field(None, ge=1, le=5)


class ValuesResponse(BaseModel):
    """Schema for professional values response"""
    id: str
    student_id: str
    autonomy: int
    creativity: int
    helping_others: int
    job_security: int
    salary: int
    work_life_balance: int
    prestige: int
    variety: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
