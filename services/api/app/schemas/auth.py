from pydantic import BaseModel, ConfigDict

from app.models.enums import UserRole


class AuthenticatedUser(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    user_id: str
    email: str
    display_name: str
    role: UserRole
    auth_provider: str = "development-header-auth"


class CurrentUserResponse(BaseModel):
    user: AuthenticatedUser
