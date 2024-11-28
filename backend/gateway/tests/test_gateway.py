import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

import unittest
from unittest.mock import MagicMock, patch
from gateway.src.gateway import GatewayService

class GatewayServiceTest(unittest.TestCase):
    def setUp(self):
        self.gateway_service = GatewayService()

    @patch('gateway.src.gateway.GatewayService.extract_segment_file_request')
    def test_extract_segment_file_request(self, mock_extract):
        test_request = MagicMock()
        mock_extract.return_value = test_request
        req = self.gateway_service.extract_segment_file_request(test_request)
        self.assertEqual(req, test_request)

    @patch('gateway.src.gateway.GatewayService.extract_user_data')
    def test_extract_user_data(self, mock_extract):
        test_request = MagicMock()
        mock_extract.return_value = test_request
        req = self.gateway_service.extract_user_data(test_request)
        self.assertEqual(req, test_request)

    @patch('gateway.src.gateway.GatewayService.extract_model_data')
    def test_extract_model_data(self, mock_extract):
        test_request = MagicMock()
        mock_extract.return_value = test_request
        req = self.gateway_service.extract_model_data(test_request)
        self.assertEqual(req, test_request)

    @patch('gateway.src.gateway.GatewayService.validate_request')
    def test_validate_request(self, mock_validate):
        test_request = MagicMock()
        mock_validate.return_value = test_request
        req = self.gateway_service.validate_request(test_request)
        self.assertEqual(req, test_request)

    @patch('gateway.src.gateway.GatewayService.create_user')
    def test_create_user(self, mock_create):
        test_request = MagicMock()
        mock_create.return_value = None
        self.assertIsNone(self.gateway_service.create_user(test_request))

    @patch('gateway.src.gateway.GatewayService.login')
    def test_login(self, mock_login):
        test_request = MagicMock()
        mock_login.return_value = None
        self.assertIsNone(self.gateway_service.login(test_request))

    @patch('gateway.src.gateway.GatewayService.generate_llm_output')
    def test_generate_llm_output(self, mock_generate):
        test_request = MagicMock()
        mock_generate.return_value = None
        self.assertIsNone(self.gateway_service.generate_llm_output(test_request))

    @patch('gateway.src.gateway.GatewayService.build_model')
    def test_build_model(self, mock_build):
        test_request = MagicMock()
        mock_build.return_value = None
        self.assertIsNone(self.gateway_service.build_model(test_request))

    @patch('gateway.src.gateway.GatewayService.get_models')
    def test_get_models(self, mock_get):
        test_request = MagicMock()
        mock_get.return_value = None
        self.assertIsNone(self.gateway_service.get_models(test_request))

    @patch('gateway.src.gateway.GatewayService.upload_preview')
    def test_upload_preview(self, mock_upload):
        test_request = MagicMock()
        mock_upload.return_value = None
        self.assertIsNone(self.gateway_service.upload_preview(test_request))

    @patch('gateway.src.gateway.GatewayService.segment_file')
    def test_segment_file(self, mock_segment):
        test_request = MagicMock()
        mock_segment.return_value = None
        self.assertIsNone(self.gateway_service.segment_file(test_request))

    @patch('gateway.src.gateway.GatewayService.download_files')
    def test_download_files(self, mock_download):
        test_request = MagicMock()
        mock_download.return_value = None
        self.assertIsNone(self.gateway_service.download_files(test_request))

    @patch('gateway.src.gateway.GatewayService.preview_data')
    def test_preview_data(self, mock_preview):
        test_request = MagicMock()
        mock_preview.return_value = None
        self.assertIsNone(self.gateway_service.preview_data(test_request))

    @patch('gateway.src.gateway.GatewayService.preview_masks')
    def test_preview_masks(self, mock_preview):
        test_request = MagicMock()
        mock_preview.return_value = None
        self.assertIsNone(self.gateway_service.preview_masks(test_request))

    @patch('gateway.src.gateway.GatewayService.epoch_status')
    def test_epoch_status(self, mock_epoch):
        test_request = MagicMock()
        mock_epoch.return_value = None
        self.assertIsNone(self.gateway_service.epoch_status(test_request))

if __name__ == '__main__':
    unittest.main()