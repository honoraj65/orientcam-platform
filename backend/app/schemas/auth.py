"""
Authentication Pydantic schemas
"""
import re
from typing import Optional, TYPE_CHECKING
from pydantic import BaseModel, EmailStr, field_validator, Field

if TYPE_CHECKING:
    from app.schemas.student import StudentProfileResponse


class UserRegister(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    first_name: str = Field(..., min_length=2, max_length=100)
    last_name: str = Field(..., min_length=2, max_length=100)

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Validate password strength"""
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError("Password must contain at least one special character")
        if " " in v:
            raise ValueError("Password must not contain spaces")
        return v

    @field_validator("first_name", "last_name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        """Validate name format"""
        if not re.match(r"^[a-zA-ZÀ-ÿ\s'-]+$", v):
            raise ValueError("Name must contain only letters, spaces, hyphens and apostrophes")
        return v.strip()


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Schema for token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: "UserInfo"


class UserInfo(BaseModel):
    """Schema for user information in token response"""
    id: str
    email: str
    role: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_verified: bool
    student_profile: Optional["StudentProfileResponse"] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class RefreshTokenRequest(BaseModel):
    """Schema for refresh token request"""
    refresh_token: str


class PasswordResetRequest(BaseModel):
    """Schema for password reset request"""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Schema for password reset confirmation"""
    token: str
    new_password: str = Field(..., min_length=8, max_length=100)

    @field_validator("new_password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Validate password strength"""
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError("Password must contain at least one special character")
        if " " in v:
            raise ValueError("Password must not contain spaces")
        return v


class MessageResponse(BaseModel):
    """Schema for generic message response"""
    message: str


# Resolve forward references
from app.schemas.student import StudentProfileResponse
UserInfo.model_rebuild()
