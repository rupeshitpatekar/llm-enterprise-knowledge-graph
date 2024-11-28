from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Azure OpenAI Settings
    AZURE_OPENAI_API_KEY: Optional[str] = None
    AZURE_OPENAI_API_BASE: Optional[str] = None
    AZURE_OPENAI_DEPLOYMENT_NAME: Optional[str] = None
    AZURE_OPENAI_API_VERSION: str = "2023-05-15"

    # AWS Bedrock Settings
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    AWS_BEDROCK_MODEL_ID: str = "anthropic.claude-v2"

    # Vector Store Settings
    CHROMA_PERSIST_DIR: str = "db"

    # Service Settings
    LLM_PROVIDER: str = "azure"  # or 'bedrock'
    MAX_WORKERS: int = 4
    ENABLE_MONITORING: bool = True

    class Config:
        env_file = ".env"


settings = Settings()