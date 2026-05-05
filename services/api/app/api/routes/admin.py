from fastapi import APIRouter, Depends

from app.dependencies.auth import require_role
from app.models.enums import UserRole
from app.schemas.auth import AuthenticatedUser

router = APIRouter()


@router.get("/ping")
async def admin_ping(
    current_user: AuthenticatedUser = Depends(require_role(UserRole.ADMIN)),
) -> dict[str, str]:
    return {
        "status": "ok",
        "message": f"Admin access confirmed for {current_user.display_name}.",
    }
