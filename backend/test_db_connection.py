"""
Test direct database connection with SQLAlchemy
"""
from sqlalchemy import create_engine, text

# Direct URL with encoded password - using direct connection
DATABASE_URL = "postgresql://postgres:Melaniekelly65%401992199284368436@db.wicratcfgcokppzpsvzf.supabase.co:5432/postgres"

try:
    print(f"Testing connection to: {DATABASE_URL[:50]}...")
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)

    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("[OK] Database connection successful!")

        # Test users table
        result = conn.execute(text("SELECT COUNT(*) FROM users"))
        count = result.scalar()
        print(f"[OK] Users table accessible. Count: {count}")

except Exception as e:
    print(f"[ERROR] Connection failed: {e}")
    import traceback
    traceback.print_exc()
