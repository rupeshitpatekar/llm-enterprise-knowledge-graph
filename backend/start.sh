#!/bin/bash

# Build or rebuild services
docker compose build

# Create and start containers in detached mode
docker compose up --detach