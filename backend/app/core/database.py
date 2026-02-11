"""
Database connection and session management
"""
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

# Create engine with Supabase pooler support
# Use NullPool for Supabase transaction pooler (port 6543)
from sqlalchemy.pool import NullPool

connect_args = {}
poolclass = None

if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
elif ":6543/" in settings.DATABASE_URL:
    # Supabase transaction pooler - use NullPool and disable prepared statements
    poolclass = NullPool
    connect_args = {"prepare_threshold": None}

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    poolclass=poolclass,
    connect_args=connect_args,
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
