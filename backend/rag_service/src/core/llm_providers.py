from abc import ABC, abstractmethod
import boto3
from langchain_openai import AzureChatOpenAI
from langchain_community.chat_models import BedrockChat
from config.settings import settings


class LLMProviderException(Exception):
    pass


class LLMProvider(ABC):
    @abstractmethod
    def get_llm(self):
        pass

    @abstractmethod
    def health_check(self) -> bool:
        pass


class AzureOpenAIProvider(LLMProvider):
    def __init__(self):
        if not all([
            settings.AZURE_OPENAI_API_KEY,
            settings.AZURE_OPENAI_API_BASE,
            settings.AZURE_OPENAI_DEPLOYMENT_NAME
        ]):
            raise LLMProviderException("Missing required Azure OpenAI configuration")

        self.llm = AzureChatOpenAI(
            azure_deployment=settings.AZURE_OPENAI_DEPLOYMENT_NAME,
            openai_api_version=settings.AZURE_OPENAI_API_VERSION,
            azure_endpoint=settings.AZURE_OPENAI_API_BASE,
            api_key=settings.AZURE_OPENAI_API_KEY,
            temperature=0
        )

    def get_llm(self):
        return self.llm

    def health_check(self) -> bool:
        try:
            # Simple completion to check if service is responding
            response = self.llm.predict("test")
            return True
        except Exception:
            return False


class AWSBedrockProvider(LLMProvider):
    def __init__(self):
        if not all([
            settings.AWS_ACCESS_KEY_ID,
            settings.AWS_SECRET_ACCESS_KEY
        ]):
            raise LLMProviderException("Missing required AWS Bedrock configuration")

        self.bedrock_client = boto3.client(
            service_name="bedrock-runtime",
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )

        self.llm = BedrockChat(
            model_id=settings.AWS_BEDROCK_MODEL_ID,
            client=self.bedrock_client,
            model_kwargs={"temperature": 0}
        )

    def get_llm(self):
        return self.llm

    def health_check(self) -> bool:
        try:
            response = self.llm.predict("test")
            return True
        except Exception:
            return False