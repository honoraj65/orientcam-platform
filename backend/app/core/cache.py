"""
Redis cache utilities
"""
import redis
from datetime import timedelta
from typing import Optional
from app.core.config import settings

# Redis client
try:
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    redis_client.ping()
except (redis.ConnectionError, redis.TimeoutError):
    # Redis not available, use None (disable caching)
    redis_client = None


def store_refresh_token(user_id: str, token: str, expire_days: int = 7) -> None:
    """Store a refresh token in Redis"""
    if not redis_client:
        return

    key = f"refresh_token:{user_id}"
    redis_client.setex(key, timedelta(days=expire_days), token)


def verify_refresh_token(user_id: str, token: str) -> bool:
    """Verify if a refresh token is valid"""
    if not redis_client:
        return True  # Skip verification if Redis unavailable

    key = f"refresh_token:{user_id}"
    stored_token = redis_client.get(key)
    return stored_token == token


def revoke_refresh_token(user_id: str) -> None:
    """Revoke a refresh token"""
    if not redis_client:
        return

    key = f"refresh_token:{user_id}"
    redis_client.delete(key)


def increment_login_attempts(email: str, expire_seconds: int = 900) -> int:
    """Increment login attempts counter"""
    if not redis_client:
        return 0

    key = f"login_attempts:{email}"
    attempts = redis_client.incr(key)

    if attempts == 1:
        redis_client.expire(key, expire_seconds)

    return attempts


def reset_login_attempts(email: str) -> None:
    """Reset login attempts counter"""
    if not redis_client:
        return

    key = f"login_attempts:{email}"
    redis_client.delete(key)


def get_login_attempts(email: str) -> int:
    """Get current login attempts count"""
    if not redis_client:
        return 0

    key = f"login_attempts:{email}"
    attempts = redis_client.get(key)
    return int(attempts) if attempts else 0


def store_password_reset_token(email: str, token: str, expire_minutes: int = 15) -> None:
    """Store a password reset token"""
    if not redis_client:
        return

    key = f"password_reset:{email}"
    redis_client.setex(key, timedelta(minutes=expire_minutes), token)


def verify_password_reset_token(email: str, token: str) -> bool:
    """Verify a password reset token"""
    if not redis_client:
        return True

    key = f"password_reset:{email}"
    stored_token = redis_client.get(key)

    if stored_token == token:
        redis_client.delete(key)
        return True

    return False
