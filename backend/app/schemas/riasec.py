"""
RIASEC test Pydantic schemas
"""
from typing import Dict, List, Optional
from pydantic import BaseModel, field_validator, Field


class RiasecDimensionResponse(BaseModel):
    """Schema for RIASEC dimension"""
    code: str
    name: str
    description: str
    color: str

    class Config:
        from_attributes = True


class RiasecQuestionResponse(BaseModel):
    """Schema for RIASEC question"""
    id: str
    dimension_id: str
    question_number: int
    text: str
    reverse_scored: bool

    class Config:
        from_attributes = True


class RiasecTestQuestionsResponse(BaseModel):
    """Schema for RIASEC test with all questions"""
    version: str = "1.0"
    dimensions: List[RiasecDimensionResponse]
    questions: List[RiasecQuestionResponse]
    answer_scale: Dict[str, str] = {
        "1": "Pas du tout d'accord",
        "2": "Peu d'accord",
        "3": "Moyennement d'accord",
        "4": "D'accord",
        "5": "Tout à fait d'accord"
    }


class RiasecAnswer(BaseModel):
    """Schema for a single RIASEC answer"""
    question_number: int = Field(..., ge=1, le=30)
    answer: int = Field(..., ge=1, le=5)


class RiasecSubmit(BaseModel):
    """Schema for submitting RIASEC test"""
    answers: List[RiasecAnswer] = Field(..., min_length=30, max_length=30)
    duration_seconds: Optional[int] = Field(None, ge=0, le=7200)  # Max 2 hours

    @field_validator("answers")
    @classmethod
    def validate_answers(cls, v: List[RiasecAnswer]) -> List[RiasecAnswer]:
        """Validate that all 30 questions are answered exactly once"""
        if len(v) != 30:
            raise ValueError("Exactly 30 answers required (one per question)")

        # Check for duplicate question numbers
        question_numbers = [answer.question_number for answer in v]
        if len(set(question_numbers)) != 30:
            raise ValueError("Each question must be answered exactly once")

        # Check that all questions 1-30 are present
        if set(question_numbers) != set(range(1, 31)):
            raise ValueError("All questions from 1 to 30 must be answered")

        return v

    @field_validator("duration_seconds")
    @classmethod
    def validate_duration(cls, v: Optional[int]) -> Optional[int]:
        """Validate test duration"""
        if v is not None:
            if v < 60:  # Less than 1 minute seems too fast
                raise ValueError("Test duration seems too short (minimum 60 seconds)")
            if v > 7200:  # More than 2 hours seems suspicious
                raise ValueError("Test duration exceeds maximum allowed (2 hours)")

        return v


class RiasecScores(BaseModel):
    """Schema for RIASEC scores"""
    realistic: int
    investigative: int
    artistic: int
    social: int
    enterprising: int
    conventional: int


class RiasecInterpretation(BaseModel):
    """Schema for RIASEC interpretation"""
    dimension_code: str
    dimension_name: str
    score: int
    description: str
    typical_careers: List[str]
    color: str


class RiasecResultResponse(BaseModel):
    """Schema for RIASEC test result"""
    test_id: str
    scores: RiasecScores
    holland_code: str
    interpretations: List[RiasecInterpretation]
    created_at: str

    class Config:
        from_attributes = True


class RiasecHistoryItem(BaseModel):
    """Schema for RIASEC test history item"""
    id: str
    holland_code: str
    realistic_score: int
    investigative_score: int
    artistic_score: int
    social_score: int
    enterprising_score: int
    conventional_score: int
    duration_seconds: Optional[int]
    created_at: str

    class Config:
        from_attributes = True


class RiasecCareerMatch(BaseModel):
    """Schema for career matching based on RIASEC"""
    holland_code: str
    matching_careers: List[str]
    partially_matching_careers: List[str]
    description: str


class RiasecDraftSave(BaseModel):
    """Schema for saving RIASEC test draft"""
    answers: Dict[str, int] = Field(default_factory=dict)  # {question_id: answer_value}
    current_question_index: int = Field(default=0, ge=0, le=29)


class RiasecDraftResponse(BaseModel):
    """Schema for RIASEC test draft response"""
    answers: Dict[str, int]
    current_question_index: int
    updated_at: str

    class Config:
        from_attributes = True
