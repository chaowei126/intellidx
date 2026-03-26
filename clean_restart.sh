#!/bin/bash

set -e

echo "🚀 Stopping running containers..."
docker-compose down

echo "🧹 Removing all stopped containers, networks, and dangling images..."
docker system prune -a -f --volumes

echo "🗑️ Explicitly clearing old project images to avoid cache issues..."
docker rmi intellidx_frontend:latest intellidx_backend:latest intellidx_worker:latest -f 2>/dev/null || true

echo "🔨 Rebuilding the Docker images from scratch (without cache)..."
docker-compose build --no-cache

echo "✨ Starting the application in detached mode..."
docker-compose up -d

echo "✅ Restart complete! You can access the application at http://localhost:8080"
