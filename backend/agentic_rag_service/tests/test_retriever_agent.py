import unittest
from unittest.mock import patch, MagicMock
from agentic_rag_service.src.services.retriever_agent import RetrieverAgentService

class TestRetrieverAgentService(unittest.TestCase):

    @patch('services.retriever_agent.ClientsUtils.get_search_client_config')
    @patch('services.retriever_agent.SearchClient')
    def test_retrieve_documents_returns_documents(self, MockSearchClient, mock_get_config):
        mock_get_config.return_value = ('endpoint', 'index_name', 'api_key')
        mock_client = MockSearchClient.return_value
        mock_client.search.return_value = [
            {"metadata_storage_path": "path1", "content": "content1"},
            {"metadata_storage_path": "path2", "content": "content2"}
        ]

        result = RetrieverAgentService.retrieve_documents("query")

        self.assertEqual(len(result), 2)
        self.assertEqual(result[0]["id"], "path1")
        self.assertEqual(result[0]["text"], "content1")

    @patch('services.retriever_agent.ClientsUtils.get_search_client_config')
    @patch('services.retriever_agent.SearchClient')
    def test_retrieve_documents_handles_error(self, MockSearchClient, mock_get_config):
        mock_get_config.return_value = ('endpoint', 'index_name', 'api_key')
        mock_client = MockSearchClient.return_value
        mock_client.search.side_effect = Exception("Search error")

        result = RetrieverAgentService.retrieve_documents("query")

        self.assertIn("error", result)
        self.assertEqual(result["error"], "Search error")

    @patch('services.retriever_agent.ClientsUtils.get_search_client_config')
    @patch('services.retriever_agent.SearchClient')
    def test_update_ranking_parameters_updates_successfully(self, MockSearchClient, mock_get_config):
        mock_get_config.return_value = ('endpoint', 'index_name', 'api_key')
        mock_client = MockSearchClient.return_value

        result = RetrieverAgentService.update_ranking_parameters(["keyword1", "keyword2"])

        self.assertEqual(result["status"], "success")
        self.assertEqual(result["message"], "Ranking parameters updated successfully.")
        mock_client.create_or_update_scoring_profile.assert_called_once()

    @patch('services.retriever_agent.ClientsUtils.get_search_client_config')
    @patch('services.retriever_agent.SearchClient')
    def test_update_ranking_parameters_handles_error(self, MockSearchClient, mock_get_config):
        mock_get_config.return_value = ('endpoint', 'index_name', 'api_key')
        mock_client = MockSearchClient.return_value
        mock_client.create_or_update_scoring_profile.side_effect = Exception("Update error")

        result = RetrieverAgentService.update_ranking_parameters(["keyword1", "keyword2"])

        self.assertEqual(result["status"], "error")
        self.assertEqual(result["message"], "Update error")