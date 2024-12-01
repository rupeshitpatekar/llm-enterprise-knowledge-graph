# airports_service/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY shared/ /app/shared/

COPY agentic_rag_service/ /app/agentic_rag_service/
COPY agentic_rag_service/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

# Set the PYTHONPATH to include the /app directory
ENV PYTHONPATH=/app:/app/agentic_rag_service/src

CMD ["nameko", "run", "--config", "agentic_rag_service/config.yml", "agentic_rag_service"]