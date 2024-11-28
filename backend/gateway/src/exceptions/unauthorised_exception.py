import json
from werkzeug.wrappers import Response

class UnauthorizedException(Exception):
    status_code = 401
    message = {
        "title": "Unauthorized",
        "status": 401,
        "detail": "Not Authenticated",
        "message": "error.http.401"
    }

    def to_response(self):
        response = Response(
            response=json.dumps(self.message),
            status=self.status_code,
            mimetype='application/json'
        )
        return response