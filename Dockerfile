# 1. Build stage
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. Serve built files using Nginx
FROM nginx:stable-alpine

# Видаляємо стандартну nginx сторінку
RUN rm -rf /usr/share/nginx/html/*

# Копіюємо Vue зібраний frontend
COPY --from=builder /app/dist /usr/share/nginx/html

# Копіюємо кастомний nginx конфіг (опціонально)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]