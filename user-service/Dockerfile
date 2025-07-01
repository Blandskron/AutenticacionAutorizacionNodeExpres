# user-service/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Puerto expuesto (por defecto 4000)
EXPOSE 4000

CMD ["node", "index.js"]
