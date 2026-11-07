import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "AgentFlow Execution API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api"
    
    # CORS Origins allowed to communicate with backend
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # Database URL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./agentflow.db")
    
    # AI Providers Configuration
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Engine limits & safety timeouts
    DEFAULT_TIMEOUT_SECONDS: int = int(os.getenv("DEFAULT_TIMEOUT_SECONDS", "60"))
    MAX_LOOP_ITERATIONS: int = int(os.getenv("MAX_LOOP_ITERATIONS", "25"))

settings = Settings()
