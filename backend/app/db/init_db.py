"""
Complete database initialization script
Runs migrations and loads all seed data
"""
import subprocess
import sys
import logging
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def run_migrations():
    """Run Alembic migrations"""
    logger.info("Running database migrations...")
    try:
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            check=True,
            capture_output=True,
            text=True
        )
        logger.info("Migrations completed successfully")
        logger.debug(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"Migration failed: {e.stderr}")
        return False


def load_seeds():
    """Load all seed data"""
    logger.info("Loading seed data...")

    # Load RIASEC questions
    try:
        logger.info("Loading RIASEC questions...")
        from app.db.seeds.load_riasec import main as load_riasec
        load_riasec()
    except Exception as e:
        logger.error(f"Failed to load RIASEC seeds: {e}")
        return False

    # Load programs
    try:
        logger.info("Loading academic programs...")
        from app.db.seeds.load_programs import main as load_programs
        load_programs()
    except Exception as e:
        logger.error(f"Failed to load program seeds: {e}")
        return False

    logger.info("All seed data loaded successfully")
    return True


def main():
    """Main initialization"""
    logger.info("=" * 60)
    logger.info("Starting database initialization")
    logger.info("=" * 60)

    # Step 1: Run migrations
    if not run_migrations():
        logger.error("Database initialization failed at migration step")
        sys.exit(1)

    # Step 2: Load seeds
    if not load_seeds():
        logger.error("Database initialization failed at seed loading step")
        sys.exit(1)

    logger.info("=" * 60)
    logger.info("Database initialization completed successfully")
    logger.info("=" * 60)


if __name__ == "__main__":
    main()
