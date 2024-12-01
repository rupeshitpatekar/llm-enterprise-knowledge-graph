# gateway/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY shared/ /app/shared/

COPY gateway/ /app/gateway/
COPY gateway/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

ENV PYTHONPATH=/app:/app/gateway/src

CMD ["nameko", "run", "--config", "gateway/config.yml", "gateway"]