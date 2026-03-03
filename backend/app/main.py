"""
OrientUniv API - Main FastAPI application
"""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import logging
from datetime import datetime

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.endpoints import auth, student, riasec, programs, recommendations, ubertoua

# Import all models so Base.metadata.create_all() knows about all tables
import app.models.user  # noqa
import app.models.student_profile  # noqa
import app.models.academic_grade  # noqa
import app.models.professional_value  # noqa
import app.models.riasec_test  # noqa
import app.models.program  # noqa
import app.models.recommendation  # noqa

# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.DEBUG else logging.WARNING,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

# Log DATABASE_URL host for diagnostics (without password)
import re as _re
_db_url = settings.DATABASE_URL
_db_host = _re.search(r'@([^/]+)', _db_url)
print(f"[DIAG] DATABASE_URL host: {_db_host.group(1) if _db_host else 'unknown'}", flush=True)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API pour la plateforme d'orientation académique et professionnelle - Université de Bertoua",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Security headers + request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests and add security headers"""
    start_time = datetime.utcnow()

    # Process request
    response = await call_next(request)

    # Security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"

    # Calculate request duration
    duration = (datetime.utcnow() - start_time).total_seconds()

    # Log request
    logger.info(
        f"{request.method} {request.url.path} "
        f"- Status: {response.status_code} "
        f"- Duration: {duration:.3f}s "
        f"- Client: {request.client.host if request.client else 'unknown'}"
    )

    return response


# Create all database tables at startup (safe: only creates missing tables)
@app.on_event("startup")
async def create_tables():
    try:
        Base.metadata.create_all(bind=engine)
        print("[STARTUP] Database tables created/verified successfully", flush=True)
    except Exception as e:
        print(f"[STARTUP] Warning: could not create tables: {e}", flush=True)

    # Run pending migrations
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            # Check if grade column is still integer
            result = conn.execute(text(
                "SELECT data_type FROM information_schema.columns "
                "WHERE table_name = 'academic_grades' AND column_name = 'grade'"
            ))
            row = result.fetchone()
            if row and row[0] in ('integer', 'bigint', 'smallint'):
                print("[STARTUP] Migrating grade column from INTEGER to FLOAT...", flush=True)
                conn.execute(text(
                    "ALTER TABLE academic_grades ALTER COLUMN grade TYPE DOUBLE PRECISION "
                    "USING grade::double precision"
                ))
                conn.commit()
                print("[STARTUP] Grade column migrated successfully!", flush=True)
            else:
                print(f"[STARTUP] Grade column type: {row[0] if row else 'unknown'} - no migration needed", flush=True)
    except Exception as e:
        print(f"[STARTUP] Migration warning: {e}", flush=True)

    # Ensure riasec_test_drafts table exists
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            result = conn.execute(text(
                "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'riasec_test_drafts')"
            ))
            exists = result.scalar()
            if not exists:
                print("[STARTUP] Creating riasec_test_drafts table...", flush=True)
                conn.execute(text("""
                    CREATE TABLE riasec_test_drafts (
                        id VARCHAR(36) PRIMARY KEY,
                        student_id VARCHAR(36) NOT NULL UNIQUE REFERENCES student_profiles(id) ON DELETE CASCADE,
                        answers JSON NOT NULL DEFAULT '{}',
                        current_question_index INTEGER NOT NULL DEFAULT 0,
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
                    )
                """))
                conn.execute(text("CREATE INDEX ix_riasec_test_drafts_student_id ON riasec_test_drafts(student_id)"))
                conn.commit()
                print("[STARTUP] riasec_test_drafts table created!", flush=True)
            else:
                print("[STARTUP] riasec_test_drafts table exists", flush=True)
    except Exception as e:
        print(f"[STARTUP] riasec_test_drafts migration warning: {e}", flush=True)


# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(student.router, prefix="/api/v1")
app.include_router(riasec.router, prefix="/api/v1")
app.include_router(programs.router, prefix="/api/v1")
app.include_router(recommendations.router, prefix="/api/v1")
app.include_router(ubertoua.router, prefix="/api/v1")


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint

    Returns API status and database connection status
    """
    try:
        # Test database connection
        from sqlalchemy import text
        from app.core.database import SessionLocal

        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        db_status = "healthy"

    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        db_status = "unhealthy"

    # Test Redis connection
    try:
        from app.core.cache import redis_client

        if redis_client:
            redis_client.ping()
            redis_status = "healthy"
        else:
            redis_status = "unavailable"

    except Exception as e:
        logger.error(f"Redis health check failed: {e}")
        redis_status = "unhealthy"

    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "version": settings.APP_VERSION,
        "database": db_status,
        "redis": redis_status,
        "timestamp": datetime.utcnow().isoformat()
    }


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint

    Returns API information and available endpoints
    """
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/health",
        "api_v1": "/api/v1"
    }


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions"""

    logger.error(f"Unhandled exception: {exc}", exc_info=True)

    detail = "Erreur interne du serveur. Veuillez réessayer plus tard."
    if settings.DEBUG:
        detail = f"Internal server error: {type(exc).__name__}: {str(exc)}"

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": detail}
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
