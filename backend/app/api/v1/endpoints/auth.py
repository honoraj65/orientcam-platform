"""
Authentication endpoints
"""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.core.cache import (
    store_refresh_token, verify_refresh_token, revoke_refresh_token,
    increment_login_attempts, reset_login_attempts, get_login_attempts
)
from app.core.config import settings
from app.core.deps import get_current_user
from app.models.user import User
from app.models.student_profile import StudentProfile
from app.schemas.auth import (
    UserRegister, UserLogin, TokenResponse, UserInfo,
    RefreshTokenRequest, MessageResponse
)
from app.api.v1.endpoints.student import calculate_completion_percentage

router = APIRouter(prefix="/auth", tags=["Authentication"])
# Force reload


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new student user

    - **email**: Valid email address (must be unique)
    - **password**: Strong password (min 8 chars, uppercase, lowercase, digit, special char)
    - **first_name**: Student's first name
    - **last_name**: Student's last name
    """

    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create user
    user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        role="student",
        is_active=True,
        is_verified=False
    )
    db.add(user)
    db.flush()

    # Create student profile
    student_profile = StudentProfile(
        user_id=user.id,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        completion_percentage=10  # Email + name = 10%
    )
    db.add(student_profile)
    db.commit()
    db.refresh(user)
    db.refresh(student_profile)

    # Generate tokens
    access_token = create_access_token(
        user_id=user.id,
        email=user.email,
        role=user.role
    )

    refresh_token = create_refresh_token(
        user_id=user.id,
        email=user.email,
        role=user.role
    )

    # Store refresh token in Redis
    store_refresh_token(user.id, refresh_token, settings.REFRESH_TOKEN_EXPIRE_DAYS)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserInfo(
            id=user.id,
            email=user.email,
            role=user.role,
            first_name=student_profile.first_name,
            last_name=student_profile.last_name,
            is_verified=user.is_verified
        )
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login with email and password

    - **email**: User's email address
    - **password**: User's password

    Returns JWT access token and refresh token
    """

    # Check login attempts
    attempts = get_login_attempts(credentials.email)
    if attempts >= 5:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Please try again in 15 minutes."
        )

    # Get user by email
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user or not verify_password(credentials.password, user.password_hash):
        # Increment failed attempts
        increment_login_attempts(credentials.email, expire_seconds=900)

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive. Please contact support."
        )

    # Reset login attempts on successful login
    reset_login_attempts(credentials.email)

    # Get student profile if exists
    student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()

    # Generate tokens
    access_token = create_access_token(
        user_id=user.id,
        email=user.email,
        role=user.role
    )

    refresh_token = create_refresh_token(
        user_id=user.id,
        email=user.email,
        role=user.role
    )

    # Store refresh token in Redis
    store_refresh_token(user.id, refresh_token, settings.REFRESH_TOKEN_EXPIRE_DAYS)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserInfo(
            id=user.id,
            email=user.email,
            role=user.role,
            first_name=student_profile.first_name if student_profile else None,
            last_name=student_profile.last_name if student_profile else None,
            is_verified=user.is_verified
        )
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(token_data: RefreshTokenRequest, db: Session = Depends(get_db)):
    """
    Refresh access token using refresh token

    - **refresh_token**: Valid refresh token

    Returns new access token and refresh token
    """

    try:
        payload = decode_token(token_data.refresh_token)

        # Verify token type
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        # Verify refresh token in Redis
        if not verify_refresh_token(user_id, token_data.refresh_token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token"
            )

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    # Get user
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )

    # Get student profile
    student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()

    # Generate new tokens
    new_access_token = create_access_token(
        user_id=user.id,
        email=user.email,
        role=user.role
    )

    new_refresh_token = create_refresh_token(
        user_id=user.id,
        email=user.email,
        role=user.role
    )

    # Store new refresh token
    store_refresh_token(user.id, new_refresh_token, settings.REFRESH_TOKEN_EXPIRE_DAYS)

    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserInfo(
            id=user.id,
            email=user.email,
            role=user.role,
            first_name=student_profile.first_name if student_profile else None,
            last_name=student_profile.last_name if student_profile else None,
            is_verified=user.is_verified
        )
    )


@router.post("/logout", response_model=MessageResponse)
async def logout(current_user: User = Depends(get_current_user)):
    """
    Logout current user (revoke refresh token)

    Requires valid access token in Authorization header
    """

    # Revoke refresh token from Redis
    revoke_refresh_token(current_user.id)

    return MessageResponse(message="Successfully logged out")


@router.get("/me", response_model=UserInfo)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current authenticated user information

    Requires valid access token in Authorization header
    """

    # Get student profile with eager loading
    student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()

    # Recalculate completion percentage if student profile exists
    if student_profile:
        print(f"\n>>> GET /auth/me called for user {current_user.id}")
        print(f">>> Current stored percentage: {student_profile.completion_percentage}%")
        new_percentage = calculate_completion_percentage(student_profile, db)
        print(f">>> Calculated new percentage: {new_percentage}%")
        if student_profile.completion_percentage != new_percentage:
            print(f">>> Updating percentage from {student_profile.completion_percentage}% to {new_percentage}%")
            student_profile.completion_percentage = new_percentage
            db.commit()
            db.refresh(student_profile)
            print(f">>> Database updated successfully")
        else:
            print(f">>> No update needed, percentage unchanged")

    # Build UserInfo response with student_profile
    return UserInfo(
        id=current_user.id,
        email=current_user.email,
        role=current_user.role,
        first_name=student_profile.first_name if student_profile else None,
        last_name=student_profile.last_name if student_profile else None,
        is_verified=current_user.is_verified,
        student_profile=student_profile,
        created_at=current_user.created_at.isoformat() if current_user.created_at else None
    )
