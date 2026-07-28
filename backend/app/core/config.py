import os
from typing import Optional

try:
    from pydantic_settings import BaseSettings

    class Settings(BaseSettings):
        PROJECT_NAME: str = "MailPilot AI"
        VERSION: str = "1.0.0"
        API_V1_STR: str = "/api/v1"
        
        ENV: str = "development"
        DATABASE_URL: str = "sqlite:///./mailpilot.db"
        
        SECRET_KEY: str = "mailpilot-ai-super-secret-key-change-in-production-2026"
        ENCRYPTION_KEY: str = "c2VsZWN0aXZlLWxvY2FsLW1haWxwaWxvdC1zZWNyZXQtZmtleT0="
        
        GMAIL_CLIENT_ID: Optional[str] = None
        GMAIL_CLIENT_SECRET: Optional[str] = None
        GMAIL_REDIRECT_URI: str = "http://localhost:5173/oauth/callback"
        
        USE_MOCK_DATA: bool = True
        
        class Config:
            env_file = ".env"
            case_sensitive = True

except ImportError:
    class Settings:
        PROJECT_NAME: str = "MailPilot AI"
        VERSION: str = "1.0.0"
        API_V1_STR: str = "/api/v1"
        ENV: str = "development"
        DATABASE_URL: str = "sqlite:///./mailpilot.db"
        SECRET_KEY: str = "mailpilot-ai-super-secret-key-change-in-production-2026"
        ENCRYPTION_KEY: str = "c2VsZWN0aXZlLWxvY2FsLW1haWxwaWxvdC1zZWNyZXQtZmtleT0="
        GMAIL_CLIENT_ID: Optional[str] = None
        GMAIL_CLIENT_SECRET: Optional[str] = None
        GMAIL_REDIRECT_URI: str = "http://localhost:5173/oauth/callback"
        USE_MOCK_DATA: bool = True

settings = Settings()
