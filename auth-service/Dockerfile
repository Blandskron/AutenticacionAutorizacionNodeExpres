# auth-service/Dockerfile
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos
COPY package*.json ./
RUN npm install

COPY . .

# Puerto expuesto (por defecto 3000)
EXPOSE 3000

# Comando para iniciar el servicio
CMD ["node", "index.js"]
