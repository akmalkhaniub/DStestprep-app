from fastapi import APIRouter

from app.api.routes import admin, catalog, health, identity

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(identity.router, prefix="/me", tags=["identity"])
api_router.include_router(catalog.router, tags=["catalog"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
