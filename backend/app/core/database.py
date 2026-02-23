"""
Database connection and session management
"""
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import NullPool
from urllib.parse import urlparse, unquote
from app.core.config import settings

# Parse DATABASE_URL and build engine with explicit parameters
# This handles usernames with dots (Supabase pooler format)
def create_db_engine():
    url = settings.DATABASE_URL
    if url.startswith("sqlite"):
        return create_engine(url, connect_args={"check_same_thread": False})

    parsed = urlparse(url)
    username = unquote(parsed.username)
    password = unquote(parsed.password)
    host = parsed.hostname
    port = parsed.port or 5432
    dbname = parsed.path.lstrip("/")

    print(f"[DB] Connecting to {host}:{port} as {username}", flush=True)

    import psycopg2

    def creator():
        return psycopg2.connect(
            host=host,
            port=port,
            user=username,
            password=password,
            dbname=dbname,
            sslmode="require",
            connect_timeout=10,
        )

    return create_engine(
        "postgresql+psycopg2://",
        creator=creator,
        poolclass=NullPool,
        pool_pre_ping=True,
    )

engine = create_db_engine()

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
