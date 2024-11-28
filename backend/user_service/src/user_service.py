import uuid
import json
import bcrypt
import jwt
from nameko.rpc import rpc
from nameko.web.handlers import http
from nameko_redis import Redis
import datetime

JWT_SECRET = "c19d5fdc16165cdec35c2eaf5ec642fd9677e61e453976390b5866693c34744d25fa8a2f20e6960143da0400cedbb543209232e9b4dfd0158b5b96f8fe5c71dc8d1ac5c127498b31ea85c3ecaeb2c52630ab35b2ee23d12f1c20968b2c818d34c036a8c0e0490d710edbc9357049e614ca791eee8c3061ef243c611145f214d205e141c0f834f3cc1823ea29e1f276df3ea5ebc356daf31c8a2c26a54f39069f4fdcbd55b0ae7f6cfb92bfd6f8b8d680f941a086731eaf2a32fc78712dcb4e6ae1dda3ec66895648d448b6bf78ecc88ed1d2cdf8ca94e5610c366414a635a20ecc2076f2da1830def35b3d7c5bd17d8397f9cd7bf5341dddb966ade6dc39f494c0f7e1bc2994e121484b3192f5e3a0ea0243130a241382d2f96c910145ca919448e78f2c5feeefa76278a866322cd3b43bc34be893962b0be003f9525f4a607b"
JWT_ALGORITHM = "HS256"

class UserService:
    name = "user_service"
    redis = Redis('development')

    @rpc
    def create_user(self, username, password):
        hashed_pw = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt())
        user_id = uuid.uuid4().hex
        self.redis.set(f"user:{username}", json.dumps({"user_id": user_id, "password": hashed_pw.decode('utf8')}))
        return user_id

    @rpc
    def login(self, username, password):
        user_data = self.redis.get(f"user:{username}")
        if not user_data:
            return None
        user_data = json.loads(user_data)
        hashed_pw = user_data['password'].encode('utf8')
        if bcrypt.checkpw(password.encode('utf8'), hashed_pw):
            expiration = datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(minutes=30)
            token = jwt.encode({"user_id": user_data["user_id"], "exp": expiration}, JWT_SECRET, algorithm=JWT_ALGORITHM)
            return token
        return None
