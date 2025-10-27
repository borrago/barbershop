# --- build ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# passe sua var de API se usar VITE_*
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

# --- run (nginx) ---
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# nginx.conf básico SPA:
RUN printf "server {\n  listen 80;\n  server_name _;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / { try_files \$uri \$uri/ /index.html; }\n}\n" > /etc/nginx/conf.d/default.conf
EXPOSE 80
