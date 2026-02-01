"""
Supabase client configuration and initialization
"""
from supabase import create_client, Client
from app.core.config import settings


class SupabaseClient:
    """Singleton Supabase client"""
    _instance: Client | None = None

    @classmethod
    def get_client(cls) -> Client:
        """Get or create Supabase client instance"""
        if cls._instance is None:
            cls._instance = create_client(
                supabase_url=settings.SUPABASE_URL,
                supabase_key=settings.SUPABASE_SERVICE_ROLE_KEY
            )
        return cls._instance

    @classmethod
    def get_anon_client(cls) -> Client:
        """Get Supabase client with anon key (for public access)"""
        return create_client(
            supabase_url=settings.SUPABASE_URL,
            supabase_key=settings.SUPABASE_ANON_KEY
        )


# Convenience function
def get_supabase() -> Client:
    """Get Supabase client instance (with service role key)"""
    return SupabaseClient.get_client()


def get_supabase_anon() -> Client:
    """Get Supabase client instance (with anon key)"""
    return SupabaseClient.get_anon_client()
