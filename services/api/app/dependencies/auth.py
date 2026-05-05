from typing import Annotated

from fastapi import Depends, Header, HTTPException, status

from app.config import get_settings
from app.models.enums import UserRole
from app.schemas.auth import AuthenticatedUser
from app.services.supabase_auth import validate_supabase_token


def _coerce_role(value: str | None) -> UserRole:
    if not value:
        return UserRole.STUDENT

    try:
        return UserRole(value.lower())
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user role header.",
        ) from exc


def _extract_bearer_token(authorization_header: str | None) -> str | None:
    if not authorization_header:
        return None

    scheme, _, token = authorization_header.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format.",
        )

    return token.strip()


async def get_current_user(
    authorization: Annotated[str | None, Header(alias="Authorization")] = None,
    x_dstp_user_id: Annotated[str | None, Header(alias="X-DSTP-User-Id")] = None,
    x_dstp_email: Annotated[str | None, Header(alias="X-DSTP-Email")] = None,
    x_dstp_name: Annotated[str | None, Header(alias="X-DSTP-Name")] = None,
    x_dstp_role: Annotated[str | None, Header(alias="X-DSTP-Role")] = None,
) -> AuthenticatedUser:
    settings = get_settings()
    access_token = _extract_bearer_token(authorization)

    if access_token:
        return await validate_supabase_token(access_token)

    if x_dstp_user_id and x_dstp_email:
        return AuthenticatedUser(
            user_id=x_dstp_user_id,
            email=x_dstp_email,
            display_name=x_dstp_name or x_dstp_email.split("@")[0],
            role=_coerce_role(x_dstp_role),
            auth_provider="header-auth",
        )

    if settings.allow_dev_auth_bypass and settings.environment != "production":
        return AuthenticatedUser(
            user_id=settings.demo_user_id,
            email=settings.demo_user_email,
            display_name=settings.demo_user_name,
            role=_coerce_role(settings.demo_user_role),
            auth_provider="dev-bypass",
        )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required.",
    )


def require_role(*allowed_roles: UserRole):
    async def dependency(
        current_user: AuthenticatedUser = Depends(get_current_user),
    ) -> AuthenticatedUser:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this resource.",
            )

        return current_user

    return dependency
