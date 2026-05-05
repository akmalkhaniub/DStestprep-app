import httpx
from fastapi import HTTPException, status

from app.config import get_settings
from app.models.enums import UserRole
from app.schemas.auth import AuthenticatedUser


def _coerce_role(value: str | None) -> UserRole:
    if not value:
        return UserRole.STUDENT

    try:
        return UserRole(value.lower())
    except ValueError:
        return UserRole.STUDENT


async def validate_supabase_token(access_token: str) -> AuthenticatedUser:
    settings = get_settings()

    if not settings.supabase_url or not settings.supabase_anon_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Supabase auth is not configured on the backend.",
        )

    user_url = f"{settings.supabase_url.rstrip('/')}/auth/v1/user"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "apikey": settings.supabase_anon_key,
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(user_url, headers=headers)
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supabase auth service is unavailable.",
        ) from exc

    if response.status_code != status.HTTP_200_OK:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
        )

    payload = response.json()
    app_metadata = payload.get("app_metadata") or {}
    user_metadata = payload.get("user_metadata") or {}
    email = payload.get("email")

    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user payload is missing an email address.",
        )

    display_name = (
        user_metadata.get("full_name")
        or user_metadata.get("name")
        or email.split("@")[0]
    )

    return AuthenticatedUser(
        user_id=payload["id"],
        email=email,
        display_name=display_name,
        role=_coerce_role(app_metadata.get("role") or user_metadata.get("role")),
        auth_provider="supabase",
    )
