"""
Authentication endpoints
"""
import secrets
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.core.cache import (
    store_refresh_token, verify_refresh_token, revoke_refresh_token,
    increment_login_attempts, reset_login_attempts, get_login_attempts,
    store_password_reset_token, verify_password_reset_token
)
from app.core.config import settings
from app.core.deps import get_current_user
from app.core.email import send_password_reset_email
from app.models.user import User
from app.models.student_profile import StudentProfile
from app.schemas.auth import (
    UserRegister, UserLogin, TokenResponse, UserInfo,
    RefreshTokenRequest, MessageResponse,
    PasswordResetRequest, PasswordResetConfirm
)
from app.schemas.student import StudentProfileResponse
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
            detail="Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email."
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
        user_id=str(user.id),
        email=user.email,
        role=user.role
    )

    refresh_token = create_refresh_token(
        user_id=str(user.id),
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
            id=str(user.id),
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
            detail="Trop de tentatives échouées. Veuillez réessayer dans 15 minutes."
        )

    # Get user by email
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user or not verify_password(credentials.password, user.password_hash):
        # Increment failed attempts
        increment_login_attempts(credentials.email, expire_seconds=900)

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect"
        )

    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Compte inactif. Veuillez contacter le support."
        )

    # Reset login attempts on successful login
    reset_login_attempts(credentials.email)

    # Get student profile if exists
    student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()

    # Generate tokens
    access_token = create_access_token(
        user_id=str(user.id),
        email=user.email,
        role=user.role
    )

    refresh_token = create_refresh_token(
        user_id=str(user.id),
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
            id=str(user.id),
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
        user_id=str(user.id),
        email=user.email,
        role=user.role
    )

    new_refresh_token = create_refresh_token(
        user_id=str(user.id),
        email=user.email,
        role=user.role
    )

    # Revoke old refresh token then store new one (rotation)
    revoke_refresh_token(user.id)
    store_refresh_token(user.id, new_refresh_token, settings.REFRESH_TOKEN_EXPIRE_DAYS)

    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserInfo(
            id=str(user.id),
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


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(data: PasswordResetRequest, db: Session = Depends(get_db)):
    """
    Demande de réinitialisation de mot de passe.
    Envoie un email avec un lien de réinitialisation.
    """
    # Toujours retourner le même message (sécurité: ne pas révéler si l'email existe)
    success_msg = "Si cette adresse email est associée à un compte, vous recevrez un lien de réinitialisation."

    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        return MessageResponse(message=success_msg)

    # Générer un token sécurisé
    token = secrets.token_urlsafe(32)
    store_password_reset_token(data.email, token, expire_minutes=15)

    # Envoyer l'email
    email_sent = send_password_reset_email(data.email, token)
    if not email_sent:
        print(f"[AUTH] Token de reset pour {data.email}: {token}", flush=True)

    return MessageResponse(message=success_msg)


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(data: PasswordResetConfirm, db: Session = Depends(get_db)):
    """
    Réinitialise le mot de passe avec le token reçu par email.
    """
    # Vérifier le token
    if not verify_password_reset_token(data.email, data.token):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lien de réinitialisation invalide ou expiré. Veuillez refaire une demande."
        )

    # Trouver l'utilisateur
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Utilisateur introuvable."
        )

    # Mettre à jour le mot de passe
    user.password_hash = hash_password(data.new_password)
    db.commit()

    # Révoquer les tokens existants
    revoke_refresh_token(user.id)

    return MessageResponse(message="Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.")


@router.get("/me", response_model=UserInfo)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current authenticated user information

    Requires valid access token in Authorization header
    """

    # Get student profile and immediately extract data to avoid lazy loading issues
    profile_data = None
    first_name = None
    last_name = None
    try:
        sp = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
        if sp:
            # Extract all column values immediately while session is clean
            first_name = sp.first_name
            last_name = sp.last_name
            completion = sp.completion_percentage or 0

            # Recalculate completion percentage
            try:
                new_percentage = calculate_completion_percentage(sp, db)
                if sp.completion_percentage != new_percentage:
                    sp.completion_percentage = new_percentage
                    db.commit()
                completion = sp.completion_percentage or 0
            except Exception as e:
                print(f"[auth/me] Warning: could not recalculate completion: {e}", flush=True)
                try:
                    db.rollback()
                except Exception:
                    pass

            # Build profile response from individual fields (avoids ORM lazy loading)
            profile_data = StudentProfileResponse(
                id=str(sp.id),
                user_id=str(sp.user_id),
                user_type=sp.user_type,
                university_establishment=sp.university_establishment,
                university_department=sp.university_department,
                university_level=sp.university_level,
                first_name=sp.first_name,
                last_name=sp.last_name,
                phone=sp.phone,
                gender=sp.gender,
                date_of_birth=sp.date_of_birth,
                city=sp.city,
                region=sp.region,
                current_education_level=sp.current_education_level,
                bac_series=sp.bac_series,
                bac_year=sp.bac_year,
                bac_grade=sp.bac_grade,
                max_annual_budget=sp.max_annual_budget,
                financial_situation=sp.financial_situation,
                financial_aid_eligible=sp.financial_aid_eligible,
                completion_percentage=completion,
                avatar_url=sp.avatar_url,
            )
    except Exception as e:
        print(f"[auth/me] Warning: could not build student profile: {e}", flush=True)

    # Build UserInfo response
    return UserInfo(
        id=str(current_user.id),
        email=current_user.email,
        role=current_user.role,
        first_name=first_name,
        last_name=last_name,
        is_verified=current_user.is_verified,
        student_profile=profile_data,
        created_at=current_user.created_at.isoformat() if current_user.created_at else None
    )
