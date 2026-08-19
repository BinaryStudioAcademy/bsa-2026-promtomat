FROM node:24.19.0 AS frontend-builder

ARG VITE_APP_NODE_ENV
ENV VITE_APP_NODE_ENV=$VITE_APP_NODE_ENV
ARG VITE_APP_API_ORIGIN_URL
ENV VITE_APP_API_ORIGIN_URL=$VITE_APP_API_ORIGIN_URL
ARG VITE_APP_PROXY_SERVER_URL
ENV VITE_APP_PROXY_SERVER_URL=$VITE_APP_PROXY_SERVER_URL

WORKDIR /app
COPY package*.json tsconfig.json packages.d.ts ./
COPY packages/shared/ ./packages/shared/
COPY apps/frontend/package.json ./apps/frontend/
RUN npm ci

COPY apps/frontend/ ./apps/frontend/
RUN npm run build:frontend

FROM nginx:1.31.3-alpine

COPY nginx/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=frontend-builder /app/apps/frontend/build/ /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
