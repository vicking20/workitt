#/app/config.py
import os
import secrets
from pathlib import Path

DATA_DIR = Path("data").resolve()
DB_FILE = DATA_DIR / "workitt.db"

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or secrets.token_hex(32)
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or f"sqlite:///{DB_FILE}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    #session config
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = os.environ.get("PRODUCTION", "false").lower() == "true"
    REMEMBER_COOKIE_HTTPONLY = True

    PRODUCTION = os.environ.get("PRODUCTION", "false").lower() == "true"
    if PRODUCTION:
        SESSION_COOKIE_SAMESITE = "None"
        
    else:
        SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_DOMAIN = os.environ.get("SESSION_COOKIE_DOMAIN")
    
    FRONTEND_URL = os.getenv("FRONTEND_URL")

    #cors config
    @staticmethod
    def get_allowed_origins():
        if os.getenv("ALLOWED_ORIGINS"):
            return os.getenv("ALLOWED_ORIGINS").split(",")
            
        origins = [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
        ]
        
        frontend_url = os.getenv("FRONTEND_URL")
        if frontend_url:
            origins.append(frontend_url)

        is_prod = os.environ.get("PRODUCTION", "false").lower() == "true"
            
        # For development, also allow local network IPs (for mobile testing)
        if not is_prod:
            # Add regex for local network IPs
            origins.append(r"^http://(192\.168\.|10\.|localhost|127\.0\.0\.1).*")
            
        return origins

# Debug print to verify config loading
print(f"Config loaded: PRODUCTION={os.environ.get('PRODUCTION')}")
print(f"Config loaded: SESSION_COOKIE_DOMAIN={os.environ.get('SESSION_COOKIE_DOMAIN')}")
