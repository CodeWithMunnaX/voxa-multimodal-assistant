import logging
from typing import Optional
from pydantic_settings import BaseSettings
from functools import lru_cache

logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    DATABASE_URL: Optional[str] = None
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    SECRET_KEY: Optional[str] = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ENVIRONMENT: str = "development"
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache()
def get_settings():
    return Settings()

def get_config_error() -> Optional[str]:
    settings = get_settings()
    missing = []
    if not settings.DATABASE_URL: missing.append("DATABASE_URL")
    if not (settings.GEMINI_API_KEY or settings.OPENAI_API_KEY): missing.append("GEMINI_API_KEY (or OPENAI_API_KEY)")
    if not settings.SECRET_KEY: missing.append("SECRET_KEY")
    # Cloudinary is only needed for media uploads, so it doesn't block the whole API
    if not (settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET):
        logger.warning("Cloudinary is not configured; /api/media/upload will be unavailable.")

    if missing:
        error_msg = f"Missing {', '.join(missing)} in .env"
        logger.error(error_msg)
        return error_msg
    return None
