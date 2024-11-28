import base64
import json
import logging
import io
import os
from werkzeug.utils import secure_filename
from werkzeug.wrappers import Response
from nameko.rpc import RpcProxy
from nameko.web.handlers import http
from utils.token_utils import validate_token
from dtos.user_data import UserData
from dtos.model_config_data import ModelConfigData
from dtos.segment_file_request import SegmentFileRequest
from utils.file_utils import allowed_file
from exceptions.unauthorised_exception import UnauthorizedException
from zipfile import ZipFile

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SHARED_UPLOAD_FOLDER = '/mnt/data/uploads'
os.makedirs(SHARED_UPLOAD_FOLDER, exist_ok=True)


class GatewayService:
    name = 'gateway'
    user_service_rpc = RpcProxy('user_service')
    nexus_service_rpc = RpcProxy('nexus_service')
    image_segmentation_service_rpc = RpcProxy("image_segmentation_service")
    agentic_rag_service_rpc = RpcProxy("agentic_rag_service")

    @staticmethod
    def extract_segment_file_request(request):
        files = request.files.getlist('files')
        model = request.form.get('modelname')
        logger.info("Files: %s, Model: %s", files, model)
        return SegmentFileRequest(files=files, modelname=model)

    @staticmethod
    def extract_user_data(request):
        data = json.loads(request.get_data(as_text=True))
        return UserData(**data)

    @staticmethod
    def extract_model_data(request):
        data = json.loads(request.get_data(as_text=True))
        return ModelConfigData(**data)

    @staticmethod
    def validate_request(request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            logger.error("Authorization header missing")
            raise UnauthorizedException()
        
        parts = auth_header.split(' ')
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            logger.error("Authorization header format is invalid")
            raise UnauthorizedException()
        
        token = parts[1]
        logger.info("Token: %s", token)
        message = validate_token(token)
        if "User ID:" not in message:
            logger.info("Unauthorized: ", message)
            raise UnauthorizedException(message)

    @http('GET', '/services/healthcheck')
    def health_check(self, request):
        logger.info("Healthcheck endpoint called")
        return json.dumps({"status": "ok"})

    @http('POST', '/services/create-user')
    def create_user(self, request):
        logger.info("Create user endpoint called")
        try:
            user_data = self.extract_user_data(request)
            return json.dumps({"user_id": self.user_service_rpc.create_user(user_data.username, user_data.password)})
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response(json.dumps({"error": "Internal Server Error", "message": str(e)}), status=500,
                            mimetype='application/json')

    @http('POST', '/services/login')
    def login(self, request):
        logger.info("Login endpoint called")
        try:
            user_data = self.extract_user_data(request)
            token = self.user_service_rpc.login(user_data.username, user_data.password)
            if token:
                return json.dumps({"token": token})
            return json.dumps({"error": "Invalid credentials"}), 401
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response(json.dumps({"error": "Internal Server Error", "message": str(e)}), status=500,
                            mimetype='application/json')

    @http('POST', '/services/generate-llm-output')
    def generate_llm_output(self, request):
        logger.info("generate_LLM_Output called")
        try:
            self.validate_request(request)
            data = json.loads(request.get_data(as_text=True))
            logger.info("Data: %s", data)
            prompt = data['prompt']
            logger.info("Prompt: %s", prompt)
            response = self.nexus_service_rpc.generate_llm_output(prompt)
            logger.info("Response: %s", response)
            return Response(json.dumps(response), status=200, mimetype='application/json')
        except UnauthorizedException as e:
            return e.to_response()
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response(json.dumps({"error": "Internal Server Error", "message": str(e)}), status=500,
                            mimetype='application/json')

    @http('POST', '/services/generate-agentic-llm-output')
    def generate_agentic_llm_output(self, request):
        logger.info("generate_agentic_LLM_Output called")
        try:
            self.validate_request(request)
            data = json.loads(request.get_data(as_text=True))
            logger.info("Data: %s", data)
            prompt = data['prompt']
            logger.info("Prompt: %s", prompt)
            response = self.agentic_rag_service_rpc.generate_agentic_llm_output(prompt)
            logger.info("Response: %s", response)
            return Response(json.dumps(response), status=200, mimetype='application/json')
        except UnauthorizedException as e:
            return e.to_response()
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response(json.dumps({"error": "Internal Server Error", "message": str(e)}), status=500,
                            mimetype='application/json')

    @http('POST', '/services/build-model')
    def build_model(self, request):
        logger.info("Build and train a new model.")
        try:
            self.validate_request(request)
            model_data = self.extract_model_data(request)
            model_name = model_data.modelname
            epochs = model_data.epochs
            optimizer_name = model_data.optimizername
            learning_rate = model_data.learningrate
            accuracy_enhancer = model_data.accuracyenhancer
            architecture_type = model_data.architecturetype

            if not all([model_name, epochs, optimizer_name, learning_rate, architecture_type]):
                return json.dumps({
                                      'error': 'One of the required field(s) is missing [model_name, epochs, optimizer_name, learning_rate, architecture_type]'}), 400

            result = self.image_segmentation_service_rpc.build_model(model_name, int(epochs), optimizer_name,
                                                                     float(learning_rate), architecture_type,
                                                                     accuracy_enhancer)
            return Response(json.dumps(result), status=200, mimetype='application/json')
        except UnauthorizedException as e:
            return e.to_response()
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response(json.dumps({"error": "Internal Server Error", "message": str(e)}), status=500,
                            mimetype='application/json')

    @http('GET', '/services/get-models-from-db')
    def get_models(self, request):
        try:
            self.validate_request(request)
            models = self.image_segmentation_service_rpc.get_all_model_details_from_redis()
            return Response(json.dumps(models), status=200, mimetype='application/json')
        except UnauthorizedException as e:
            return e.to_response()
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response(json.dumps({"error": "Internal Server Error", "message": str(e)}), status=500,
                            mimetype='application/json')

    @http('POST', '/services/upload-preview')
    def upload_preview(self, request):
        logger.info("API route for uploading and previewing files.")
        try:
            self.validate_request(request)
            if 'files' not in request.files:
                return json.dumps({'error': 'No file part'}), 400

            files = request.files.getlist('files')

            if len(files) == 0:
                return json.dumps({'error': 'No selected files'}), 400

            saved_files = []
            for file in files:
                if file.filename == '':
                    continue
                if file and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    file.save(os.path.join(SHARED_UPLOAD_FOLDER, filename))
                    file_path = os.path.join('/app/shared-data', filename)
                    file.save(file_path)
                    saved_files.append(filename)
                else:
                    return json.dumps({'error': f'File type not allowed: {file.filename}'}), 400

            result = self.image_segmentation_service_rpc.segment_file(saved_files, None)
            return json.dumps(result)
        except UnauthorizedException as e:
            return e.to_response()
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response(json.dumps({"error": "Internal Server Error", "message": str(e)}), status=500,
                            mimetype='application/json')

    @http('POST', '/services/segment')
    def segment_file(self, request):
        logger.info("API route for segmenting uploaded files with a selected model.")
        try:
            self.validate_request(request)

            if 'files' not in request.files:
                logger.error("No files part in the request")
                return Response(json.dumps({'error': 'No file part'}), status=400, mimetype='application/json')

            segment_request = self.extract_segment_file_request(request)
            logger.info("Segment request: %s", segment_request)

            saved_files = self.save_files(segment_request.files)

            # Ensure all files are saved before calling the segmentation service
            for file_path in saved_files:
                if not os.path.exists(file_path):
                    logger.error(f"File not found: {file_path}")
                    return Response(json.dumps({'error': f'File not found: {file_path}'}), status=400,
                                    mimetype='application/json')

            result = self.image_segmentation_service_rpc.segment_file(saved_files, segment_request.modelname)

            if not isinstance(result, dict):
                logger.error("Segmentation result is not a JSON serializable dictionary")
                return Response(
                    json.dumps({"error": "Internal Server Error", "message": "Invalid segmentation result"}),
                    status=500, mimetype='application/json')

            return Response(json.dumps(result), status=200, mimetype='application/json')

        except UnauthorizedException as e:
            logger.error(f"Unauthorized error: {e}")
            return e.to_response()
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response(json.dumps({"error": "Internal Server Error", "message": str(e)}), status=500,
                            mimetype='application/json')

    @staticmethod
    def save_files(files):
        saved_files = []
        for file in files:
            if file.filename == '':
                continue
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(SHARED_UPLOAD_FOLDER, filename)
                file.save(file_path)
                saved_files.append(file_path)
            else:
                error_message = f'File type not allowed: {file.filename}'
                logger.error(error_message)
                return Response(json.dumps({'error': error_message}), status=400, mimetype='application/json')
        return saved_files

    @http('GET', '/services/download')
    def download_files(self, request):
        logger.info("API route for downloading segmented images as a zip.")
        try:
            self.validate_request(request)
            segmented_folder = 'segmented'
            if not os.path.exists(segmented_folder) or not os.listdir(segmented_folder):
                return json.dumps({'error': 'No segmented images available for download.'}), 400

            zip_buffer = io.BytesIO()
            with ZipFile(zip_buffer, 'w') as zip_file:
                for filename in sorted(os.listdir(segmented_folder)):
                    file_path = os.path.join(segmented_folder, filename)
                    zip_file.write(file_path, arcname=filename)

            zip_buffer.seek(0)
            response = {
                'zip_file': base64.b64encode(zip_buffer.getvalue()).decode('utf-8'),
                'filename': 'segmented_images.zip'
            }
            return json.dumps(response)
        except UnauthorizedException as e:
            return e.to_response()
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response(json.dumps({"error": "Internal Server Error", "message": str(e)}), status=500,
                            mimetype='application/json')

    @http('GET', '/services/build-model-preview-data')
    def preview_data(self, request):
        logger.info("API route to preview data.")
        try:
            self.validate_request(request)
            if 'data_files' not in request.files:
                return json.dumps({'error': 'No file part'}), 400

            data_files = request.files.getlist('data_files')
            if len(data_files) == 0:
                return json.dumps({'error': 'No selected files'}), 400

            saved_files = []
            for file in data_files:
                if file.filename == '':
                    continue
                if file and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    file.save(os.path.join(SHARED_UPLOAD_FOLDER, filename))
                    saved_files.append(filename)

            result = self.image_segmentation_service_rpc.segment_file(saved_files, None)
            return json.dumps(result)
        except UnauthorizedException as e:
            return e.to_response()
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response(json.dumps({"error": "Internal Server Error", "message": str(e)}), status=500,
                            mimetype='application/json')

    @http('GET', '/services/build-model-preview-masks')
    def preview_masks(self, request):
        logger.info("API route to preview mask files.")
        try:
            self.validate_request(request)
            if 'mask_files' not in request.files:
                return json.dumps({'error': 'No file part'}), 400

            mask_files = request.files.getlist('mask_files')
            if len(mask_files) == 0:
                return json.dumps({'error': 'No selected files'}), 400

            saved_files = []
            for file in mask_files:
                if file.filename == '':
                    continue
                if file and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    file.save(os.path.join(SHARED_UPLOAD_FOLDER, filename))
                    saved_files.append(filename)

            result = self.image_segmentation_service_rpc.segment_file(saved_files, None)
            return json.dumps(result)
        except UnauthorizedException as e:
            return e.to_response()
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response(json.dumps({"error": "Internal Server Error", "message": str(e)}), status=500,
                            mimetype='application/json')

    @http('GET', '/services/epoch-status')
    def epoch_status(self, request):
        logger.info("Return the current training status.")
        try:
            self.validate_request(request)
            status = self.image_segmentation_service_rpc.get_epoch_status()
            return json.dumps(status)
        except UnauthorizedException as e:
            return e.to_response()
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response(json.dumps({"error": "Internal Server Error", "message": str(e)}), status=500,
                            mimetype='application/json')

    @http("POST", "/services/feedback")
    def submit_feedback(self, request):
        """Accept feedback from the user."""
        try:
            data = request.get_json()
            user_message = data.get("user_message")
            context = data.get("context")
            response = data.get("response")
            feedback = data.get("feedback")

            if not (user_message and context and response and feedback):
                return 400, json.dumps({"error": "All fields are required."})

            result = self.agentic_rag_service.store_feedback(user_message, context, response, feedback)
            return 200, json.dumps(result)
        except Exception as e:
            logger.error(f"Error in submitting feedback: {e}")
            return 500, json.dumps({"error": "Internal Server Error", "details": str(e)})

    @http("GET", "/services/feedback-summary")
    def get_feedback_summary(self, request):
        """Retrieve a summary of all feedback."""
        try:
            result = self.agentic_rag_service.analyze_feedback()
            return 200, json.dumps(result)
        except Exception as e:
            logger.error(f"Error in retrieving feedback summary: {e}")
            return 500, json.dumps({"error": "Internal Server Error", "details": str(e)})

    @http("POST", "/services/feedback-improve")
    def improve_system_based_on_feedback(self, request):
        """Trigger system improvements based on feedback."""
        try:
            result = self.agentic_rag_service.improve_system()
            return 200, json.dumps(result)
        except Exception as e:
            logger.error(f"Error in improving system: {e}")
            return 500, json.dumps({"error": "Internal Server Error", "details": str(e)})

    @http("POST", "/services/monitor-segmentation-quality")
    def monitor_segmentation_quality(self, request):
        """Trigger system improvements based on feedback."""
        logger.info("Trigger system improvements based on feedback.")
        try:
            self.validate_request(request)

            if 'files' not in request.files:
                logger.error("No files part in the request")
                return Response(json.dumps({'error': 'No file part'}), status=400, mimetype='application/json')

            segment_request = self.extract_segment_file_request(request)
            saved_files = self.save_files(segment_request.files)

            # Ensure all files are saved before calling the segmentation service
            for file_path in saved_files:
                if not os.path.exists(file_path):
                    logger.error(f"File not found: {file_path}")
                    return Response(json.dumps({'error': f'File not found: {file_path}'}), status=400,
                                    mimetype='application/json')

            result = self.image_segmentation_service_rpc.monitor_segmentation_quality(segment_request.modelname, saved_files)

            if not isinstance(result, dict):
                logger.error("monitor_segmentation_quality result is not a JSON serializable dictionary")
                return Response(
                    json.dumps({"error": "Internal Server Error", "message": "Invalid segmentation result"}),
                    status=500, mimetype='application/json')

            return Response(json.dumps(result), status=200, mimetype='application/json')

        except UnauthorizedException as e:
            logger.error(f"Unauthorized error: {e}")
            return e.to_response()
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response(json.dumps({"error": "Internal Server Error", "message": str(e)}), status=500,
                            mimetype='application/json')