"""Settings — load from environment in production. .env recommended."""
import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./bhat_overseas.db")
    JWT_SECRET:   str = os.getenv("JWT_SECRET", "change-me-in-prod-32-chars-min!!")
    JWT_HOURS:    int = int(os.getenv("JWT_HOURS", "12"))
    OCR_BACKEND:  str = os.getenv("OCR_BACKEND", "tesseract")  # tesseract | google
    STORAGE_DIR:  str = os.getenv("STORAGE_DIR", "./storage")

    class Config:
        env_file = ".env"
        extra    = "ignore"


settings = Settings()
