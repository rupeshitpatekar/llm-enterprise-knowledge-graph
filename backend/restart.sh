#!/bin/bash

# Stop and remove containers, networks, images, and volumes
docker compose down

# Build or rebuild services
docker compose build

# Create and start containers in detached mode
docker compose up --detach