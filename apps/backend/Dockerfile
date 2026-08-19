FROM node:24.19.0 AS backend-builder

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
ARG HOST
ENV HOST=$HOST
ARG PORT
ENV PORT=$PORT

WORKDIR /app
COPY package*.json tsconfig.json packages.d.ts ./
COPY packages/shared/ ./packages/shared/
COPY apps/backend/package.json ./apps/backend/
RUN npm ci

COPY apps/backend/ ./apps/backend/
RUN npm run build:backend

EXPOSE 3001
CMD npm start -w apps/backend
