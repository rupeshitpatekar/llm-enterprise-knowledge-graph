import os

class ClientsUtils:
    @staticmethod
    def get_search_client_config():
        endpoint = os.getenv("AZURE_AI_SEARCH_ENDPOINT")
        index_name = os.getenv("AZURE_AI_SEARCH_INDEX")
        api_key = os.getenv("AZURE_AI_SEARCH_API_KEY")
        return endpoint, index_name, api_key

    @staticmethod
    def get_client_config():
        endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        api_key = os.getenv("AZURE_OPENAI_API_KEY")
        deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT_ID")
        return endpoint, api_key, deployment