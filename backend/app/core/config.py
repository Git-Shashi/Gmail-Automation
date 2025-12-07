"""
Application Configuration

Loads environment variables from .env file and provides settings to the application.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    
    All settings are loaded from .env file in the backend directory.
    """
    
    # MongoDB Configuration
    MONGODB_URL: str
    DATABASE_NAME: str = "gmail_automation"
    
    # JWT Configuration
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days
    
    # Google OAuth 2.0
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    REDIRECT_URI: str
    FRONTEND_URL: str = "http://localhost:5173"
    
    # Google Gemini AI
    GEMINI_API_KEY: str
    
    # CORS Configuration
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    
    # Application Settings
    APP_NAME: str = "Gmail Automation"
    DEBUG: bool = True
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Convert comma-separated CORS_ORIGINS to list"""
        # Allow all origins if CORS_ORIGINS is set to "*"
        if self.CORS_ORIGINS.strip() == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()
