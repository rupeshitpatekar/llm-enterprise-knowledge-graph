# user_service/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set the PYTHONPATH to include the /app directory
ENV PYTHONPATH=/app/src

CMD ["nameko", "run", "--config", "config.yml", "src.user_service"]