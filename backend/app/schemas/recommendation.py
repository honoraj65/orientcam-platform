"""
Recommendation Pydantic schemas
"""
from typing import Annotated, List, Optional
from pydantic import BaseModel, BeforeValidator, Field
from app.schemas.program import ProgramListItem

# Convert UUID objects to strings automatically
StrUUID = Annotated[str, BeforeValidator(lambda v: str(v) if v is not None else v)]


class RecommendationScores(BaseModel):
    """Schema for recommendation scores breakdown"""
    riasec_score: int = Field(..., ge=0, le=100)
    grades_score: int = Field(..., ge=0, le=100)
    values_score: int = Field(..., ge=0, le=100)
    employment_score: int = Field(..., ge=0, le=100)
    financial_score: int = Field(..., ge=0, le=100)
    total_score: int = Field(..., ge=0, le=100)


class RecommendationResponse(BaseModel):
    """Schema for recommendation response"""
    id: StrUUID
    student_profile_id: StrUUID
    program_id: StrUUID
    ranking: int
    total_score: int
    riasec_score: int
    grades_score: int
    values_score: int
    employment_score: int
    financial_score: int
    strengths: List[str]
    weaknesses: List[str]
    advice: str
    created_at: str

    class Config:
        from_attributes = True


class RecommendationWithDetails(BaseModel):
    """Schema for recommendation with program details"""
    id: StrUUID
    student_profile_id: StrUUID
    program_id: StrUUID
    ranking: int
    total_score: int
    riasec_score: int
    grades_score: int
    values_score: int
    employment_score: int
    financial_score: int
    strengths: List[str]
    weaknesses: List[str]
    advice: str
    created_at: str

    # Program details
    program: ProgramListItem

    # Compatibility score for frontend
    compatibility_score: int  # Same as total_score
    recommendations: List[str]  # Same as strengths for frontend compatibility

    class Config:
        from_attributes = True


class GenerateRecommendationsRequest(BaseModel):
    """Schema for generating recommendations request"""
    force_regenerate: bool = Field(False, description="Force regeneration even if recent recommendations exist")
    limit: Optional[int] = Field(10, ge=1, le=50, description="Maximum number of recommendations to generate")
