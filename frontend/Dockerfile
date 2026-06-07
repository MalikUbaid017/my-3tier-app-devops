# Stage 1: Build
FROM node:18-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
# Default Nginx port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
