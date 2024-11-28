import unittest
import time
from unittest.mock import patch

from gateway.src.utils.token_utils import validate_token

class TestTokenUtils(unittest.TestCase):

        @patch('gateway.src.utils.token_utils.jwt.decode')
        def test_validate_token_valid_token(self, mock_decode):
            mock_decode.return_value = {'user_id': '123', 'exp': time.time() + 1000}
            user_id = validate_token('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzI1YTU1ZDg1NmRjNDhjN2FjODU3MGE0N2Q3NzQwZDIiLCJleHAiOjE3MzAyOTE0NjR9.aYA7lmsDNwFnk8PlO3qtzWxFdv0CVkSo9_fga5WbwG0')
            assert user_id == '123'



if __name__ == '__main__':
    unittest.main()