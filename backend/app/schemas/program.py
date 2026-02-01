"""
Program Pydantic schemas
"""
from typing import List, Optional
from pydantic import BaseModel, Field


class ProgramSubjectResponse(BaseModel):
    """Schema for program subject"""
    id: str
    name: str
    credits: int
    semester: int
    is_mandatory: bool

    class Config:
        from_attributes = True


class MasterProgramBrief(BaseModel):
    """Schema for brief master program info"""
    id: str
    code: str
    name: str
    duration_years: Optional[int] = None

    class Config:
        from_attributes = True


class ProgramListItem(BaseModel):
    """Schema for program in list view"""
    id: str
    code: str
    name: str
    university: Optional[str] = None
    level: str
    domain: Optional[str] = None
    duration_years: Optional[int] = None
    department: str
    riasec_match: str
    registration_fee: int
    annual_tuition: int
    employment_rate: Optional[int] = None
    capacity: int
    is_active: bool
    master_program_id: Optional[str] = None
    master_program: Optional["MasterProgramBrief"] = None

    class Config:
        from_attributes = True
        populate_by_name = True


class ProgramDetail(BaseModel):
    """Schema for detailed program view"""
    id: str
    code: str
    name: str
    university: Optional[str] = None
    level: str
    domain: Optional[str] = None
    duration_years: Optional[int] = None
    department: str
    description: str
    objectives: Optional[str] = None
    career_prospects: Optional[str] = None

    # Prerequisites
    required_bac_series: List[str]
    min_bac_grade: Optional[int] = None
    required_subjects: Optional[List[str]] = None

    # RIASEC match
    riasec_match: str

    # Costs
    registration_fee: int
    annual_tuition: int
    total_cost_3years: int

    # Employment
    employment_rate: Optional[int] = None
    average_starting_salary: Optional[int] = None

    # Capacity
    capacity: int
    is_active: bool

    # Master program link
    master_program_id: Optional[str] = None
    master_program: Optional[MasterProgramBrief] = None

    # Subjects
    subjects: List[ProgramSubjectResponse]

    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


class ProgramSearchParams(BaseModel):
    """Schema for program search parameters"""
    holland_code: Optional[str] = Field(None, max_length=3, description="RIASEC Holland Code (1-3 letters)")
    bac_series: Optional[str] = Field(None, max_length=20, description="Bac series (e.g., 'C', 'D')")
    max_budget: Optional[int] = Field(None, ge=0, description="Maximum annual budget")
    department: Optional[str] = Field(None, max_length=100, description="Department name")
    level: Optional[str] = Field(None, max_length=20, description="Level (e.g., 'Licence', 'Master')")
    min_employment_rate: Optional[int] = Field(None, ge=0, le=100, description="Minimum employment rate")


class CompatibilityScore(BaseModel):
    """Schema for compatibility score detail"""
    criterion: str
    score: int
    weight: float
    weighted_score: float
    details: Optional[str] = None


class CompatibilityComponents(BaseModel):
    """Schema for compatibility components breakdown"""
    riasec_score: int
    riasec_weight: float
    grades_score: int
    grades_weight: float
    values_score: int
    values_weight: float
    employment_score: int
    employment_weight: float
    financial_score: int
    financial_weight: float


class ProgramCompatibility(BaseModel):
    """Schema for program compatibility result"""
    program_id: str
    program_code: str
    program_name: str
    total_score: int
    ranking: str  # "Fortement recommandé", "Recommandé", "À considérer", "Non recommandé"
    scores: List[CompatibilityScore]
    components: CompatibilityComponents
    strengths: List[str]
    weaknesses: List[str]
    advice: str

    class Config:
        from_attributes = True


class ProgramStatistics(BaseModel):
    """Schema for program statistics"""
    total_programs: int
    by_level: dict
    by_department: dict
    average_tuition: float
    average_employment_rate: float
    riasec_distribution: dict


class ProgramListResponse(BaseModel):
    """Schema for paginated program list response"""
    programs: List[ProgramListItem]
    total: int
