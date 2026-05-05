from functools import lru_cache

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=("services/api/.env", ".env"),
        env_prefix="DSTP_",
        case_sensitive=False,
    )

    app_name: str = "DS Test Prep API"
    environment: str = "development"
    api_v1_prefix: str = "/api/v1"
    database_url: str = Field(
        default="sqlite:///./services/api/dstestprep.db",
        validation_alias=AliasChoices("DSTP_DATABASE_URL", "DATABASE_URL"),
    )
    direct_url: str | None = Field(
        default=None,
        validation_alias=AliasChoices("DSTP_DIRECT_URL", "DIRECT_URL"),
    )
    supabase_url: str | None = Field(
        default=None,
        validation_alias=AliasChoices(
            "DSTP_SUPABASE_URL",
            "SUPABASE_URL",
            "EXPO_PUBLIC_SUPABASE_URL",
        ),
    )
    supabase_anon_key: str | None = Field(
        default=None,
        validation_alias=AliasChoices(
            "DSTP_SUPABASE_ANON_KEY",
            "SUPABASE_ANON_KEY",
            "EXPO_PUBLIC_SUPABASE_ANON_KEY",
        ),
    )
    auto_create_tables: bool = False
    cors_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:8081",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
            "http://127.0.0.1:8081",
            "http://localhost:19006",
            "http://127.0.0.1:19006",
        ]
    )
    cors_origin_regex: str | None = r"https?://(localhost|127\.0\.0\.1)(:\d+)?$"
    allow_dev_auth_bypass: bool = True
    demo_user_id: str = "demo-student-001"
    demo_user_email: str = "student@example.com"
    demo_user_name: str = "Demo Student"
    demo_user_role: str = "student"


@lru_cache
def get_settings() -> Settings:
    return Settings()


def normalize_database_url(url: str | None) -> str | None:
    if not url:
        return url

    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+psycopg://", 1)

    return url
