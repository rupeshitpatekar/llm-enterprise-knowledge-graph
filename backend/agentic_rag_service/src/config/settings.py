import os

class Config:
    RETRIEVER_BACKEND = os.getenv("RETRIEVER_BACKEND", "elasticsearch")
    GENERATOR_BACKEND = os.getenv("GENERATOR_BACKEND", "openai")
    CLOUD_PROVIDER = os.getenv("CLOUD_PROVIDER", "aws")
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"

config = Config()