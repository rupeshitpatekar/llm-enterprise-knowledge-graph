# user_service/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY shared/ /app/shared/

COPY user_service/ /app/user_service/
COPY user_service/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

# Set the PYTHONPATH to include the /app directory
ENV PYTHONPATH=/app

CMD ["nameko", "run", "--config", "user_service/config.yml", "user_service.src.user_service"]