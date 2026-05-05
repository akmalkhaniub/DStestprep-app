from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import get_settings, normalize_database_url


class Base(DeclarativeBase):
    pass


settings = get_settings()
engine_url = normalize_database_url(settings.database_url)

connect_args = {}
if engine_url and engine_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(engine_url, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, class_=Session)


def get_db_session() -> Generator[Session, None, None]:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
