#!/bin/bash

# Docker Hub username
DOCKER_USERNAME=blandskron

# Microservicios
SERVICES=("auth-service" "user-service")

# Tag (opcionalmente usa un tag dinámico con fecha)
TAG=latest

for SERVICE in "${SERVICES[@]}"; do
  echo "🔧 Construyendo imagen para $SERVICE..."
  docker build -t "$DOCKER_USERNAME/$SERVICE:$TAG" "./$SERVICE"

  echo "📦 Pushing $DOCKER_USERNAME/$SERVICE:$TAG a Docker Hub..."
  docker push "$DOCKER_USERNAME/$SERVICE:$TAG"
done

echo "✅ Imágenes subidas correctamente."
