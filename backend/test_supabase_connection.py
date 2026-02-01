"""
Test Supabase connection
"""
from app.core.supabase_client import get_supabase


def test_connection():
    """Test connection to Supabase database"""
    try:
        print("Testing Supabase connection...")
        supabase = get_supabase()

        # Test 1: Check if client is created
        print("[OK] Supabase client created successfully")

        # Test 2: Try to fetch RIASEC dimensions
        result = supabase.table('riasec_dimensions').select('*').execute()
        print(f"[OK] Connection successful! Found {len(result.data)} RIASEC dimensions")

        if result.data:
            print("\nRIASEC Dimensions:")
            for dim in result.data:
                print(f"  - {dim.get('code')}: {dim.get('name')}")

        return True

    except Exception as e:
        print(f"[ERROR] Connection error: {e}")
        print("\nTroubleshooting tips:")
        print("  1. Check that all environment variables are set in .env")
        print("  2. Verify that your Supabase project is running")
        print("  3. Confirm that you've run the migration scripts in Supabase SQL Editor")
        print("  4. Check your internet connection")
        return False


if __name__ == "__main__":
    success = test_connection()
    exit(0 if success else 1)
