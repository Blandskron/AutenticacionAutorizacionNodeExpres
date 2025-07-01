#!/bin/bash

# Variables
IMAGE_NAME="blandskron/user-service-express"
TAG="latest"

# Build Docker image
echo "🔨 Construyendo imagen Docker para $IMAGE_NAME..."
docker build -t $IMAGE_NAME:$TAG .

# Push a Docker Hub
echo "📤 Pushing $IMAGE_NAME:$TAG a Docker Hub..."
docker push $IMAGE_NAME:$TAG

echo "✅ Imagen enviada correctamente: $IMAGE_NAME:$TAG"
