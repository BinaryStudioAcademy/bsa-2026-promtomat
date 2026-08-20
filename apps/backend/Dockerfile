FROM node:24.19.0 AS backend-builder

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
ARG HOST
ENV HOST=$HOST
ARG PORT
ENV PORT=$PORT

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json packages.d.ts ./
COPY packages/shared/ ./packages/shared/
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
RUN pnpm install --frozen-lockfile

COPY apps/backend/ ./apps/backend/
RUN pnpm run build:backend
RUN cd /app/packages/shared && npm pkg set main=build/index.js

WORKDIR /app/apps/backend/build
ENV PATH="/app/apps/backend/node_modules/.bin:$PATH"

EXPOSE 3001
CMD ["sh", "-c", "knex migrate:latest && exec node src/index.js"]
