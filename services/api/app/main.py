import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.config import get_settings
from app.db import Base, engine
from app.models import AnalyticsEvent, Question, Quiz, QuizAttempt, Subject, Topic, User

logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    settings = get_settings()
    is_development = settings.environment.lower() == "development"
    cors_mode = "wildcard" if is_development else "restricted"

    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"] if is_development else settings.cors_origins,
        allow_origin_regex=None if is_development else settings.cors_origin_regex,
        allow_credentials=False if is_development else True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    def create_tables() -> None:
        logger.warning(
            "Starting %s | environment=%s | cors_mode=%s | api_prefix=%s",
            settings.app_name,
            settings.environment,
            cors_mode,
            settings.api_v1_prefix,
        )
        if settings.auto_create_tables:
            Base.metadata.create_all(bind=engine)

    app.include_router(api_router)
    app.include_router(api_router, prefix=settings.api_v1_prefix)

    return app


app = create_app()
