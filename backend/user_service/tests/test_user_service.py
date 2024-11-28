import unittest
from unittest.mock import MagicMock, patch
import bcrypt
import jwt
import json
from user_service.src.user_service import UserService, JWT_SECRET, JWT_ALGORITHM

class UserServiceTest(unittest.TestCase):
    def setUp(self):
        self.user_service = UserService()
        self.user_service.redis = MagicMock()

    def test_create_user_creates_user_with_hashed_password(self):
        username = "testuser"
        password = "password123"
        user_id = self.user_service.create_user(username, password)
        self.user_service.redis.set.assert_called_once()
        stored_data = json.loads(self.user_service.redis.set.call_args[0][1])
        self.assertEqual(stored_data["user_id"], user_id)
        self.assertTrue(bcrypt.checkpw(password.encode('utf8'), stored_data["password"].encode('utf8')))

    def test_login_returns_jwt_token_for_valid_credentials(self):
        username = "testuser"
        password = "password123"
        hashed_pw = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt()).decode('utf8')
        user_data = {"user_id": "some_user_id", "password": hashed_pw}
        self.user_service.redis.get.return_value = json.dumps(user_data)
        token = self.user_service.login(username, password)
        self.assertIsNotNone(token)
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        self.assertEqual(decoded_token["user_id"], user_data["user_id"])

    def test_login_returns_none_for_invalid_username(self):
        username = "invaliduser"
        password = "password123"
        self.user_service.redis.get.return_value = None
        token = self.user_service.login(username, password)
        self.assertIsNone(token)

    def test_login_returns_none_for_invalid_password(self):
        username = "testuser"
        password = "wrongpassword"
        hashed_pw = bcrypt.hashpw("password123".encode('utf8'), bcrypt.gensalt()).decode('utf8')
        user_data = {"user_id": "some_user_id", "password": hashed_pw}
        self.user_service.redis.get.return_value = json.dumps(user_data)
        token = self.user_service.login(username, password)
        self.assertIsNone(token)

if __name__ == '__main__':
    unittest.main()