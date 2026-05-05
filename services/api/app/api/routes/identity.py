from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.schemas.auth import AuthenticatedUser, CurrentUserResponse

router = APIRouter()


@router.get("", response_model=CurrentUserResponse)
async def get_me(
    current_user: AuthenticatedUser = Depends(get_current_user),
) -> CurrentUserResponse:
    return CurrentUserResponse(user=current_user)
