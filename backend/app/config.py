import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Required environment variables (no defaults for security)
    mongodb_url: str
    database_name: str
    secret_key: str
    
    # Optional with sensible defaults
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()