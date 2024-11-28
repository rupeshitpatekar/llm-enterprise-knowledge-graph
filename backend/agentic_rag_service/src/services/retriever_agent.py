import logging
from azure.search.documents import SearchClient
from azure.core.credentials import AzureKeyCredential

from utils.clients_utils import ClientsUtils

logger = logging.getLogger(__name__)

class RetrieverAgentService:

    @staticmethod
    def retrieve_documents(query: str, top_k: int = 5):
        try:
            logger.info(f"Retrieving documents for query: {query}")
            endpoint, index_name, api_key = ClientsUtils.get_search_client_config()
            client = SearchClient(
                endpoint=endpoint,
                index_name=index_name,
                credential=AzureKeyCredential(api_key)
            )
            results = client.search(search_text=query, top=top_k)
            documents = [{"id": doc["metadata_storage_path"], "text": doc["content"]} for doc in results if
                         "metadata_storage_path" in doc and "content" in doc]
            return documents
        except Exception as e:
            logger.error(f"Error retrieving documents: {e}")
            return {"error": str(e)}

    @staticmethod
    def update_ranking_parameters(keywords):
        """Update the ranking parameters to boost relevance for specific keywords."""
        try:
            logger.info(f"Updating ranking parameters with keywords: {keywords}")
            endpoint, index_name, api_key = ClientsUtils.get_search_client_config()
            client = SearchClient(
                endpoint=endpoint,
                index_name=index_name,
                credential=AzureKeyCredential(api_key)
            )

            # Example: Update the scoring profile to boost relevance for specific keywords
            scoring_profile = {
                "name": "keyword_boost",
                "text": {
                    "weights": {keyword: 1.5 for keyword in keywords}
                }
            }

            client.create_or_update_scoring_profile(scoring_profile)
            logger.info("Scoring profile updated successfully.")
            return {"status": "success", "message": "Ranking parameters updated successfully."}
        except Exception as e:
            logger.error(f"Error updating ranking parameters: {e}")
            return {"status": "error", "message": str(e)}