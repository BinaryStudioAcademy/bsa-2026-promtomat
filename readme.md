# Intelligent Prompt search

Improve and evaluate prompt generation for specific tasks

## 1. Introduction

### 1.1 Useful Links

- Pay attention, that we have certain [quality criteria](https://github.com/BinaryStudioAcademy/quality-criteria/blob/production/src/javascript.md), which we should follow during application development.

TODO: Add development deployment link

## 2. Domain

Promptomat is an intelligent prompt search, evaluation, and autocomplete system for AI coding tools.

## 3. Requirements

- [NodeJS](https://nodejs.org/en) (24.x.x);
- [pnpm](https://pnpm.io/) (11.x.x);
- [PostgreSQL](https://www.postgresql.org/) (18.4)

The pnpm version is pinned in the `packageManager` field, so `corepack enable pnpm` is enough to get the exact version
the project expects.

## 4. Database Schema

TODO: add database schema

## 5. Architecture

TODO: add application schema

### 5.1 Global

#### 5.1.1 Technologies

1. [Typescript](https://www.typescriptlang.org/)
2. [pnpm workspaces](https://pnpm.io/workspaces)

### 5.2 Frontend

#### 5.2.1 Technologies

1. [React](https://react.dev/) — a frontend library
2. [Redux](https://redux.js.org/) + [Redux Toolkit](https://redux-toolkit.js.org/) — a state manager
3. [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) — server state (fetching, caching, invalidation)

#### 5.2.2 Folder Structure

1. assets - static assets (images, global styles)
2. libs - shared libraries and utilities

   2.1 components - plain react components

   2.2 enums

   2.3 helpers

   2.4 hooks

   2.5 modules - separate features or functionalities

   2.6 types

3. modules - separate app features or functionalities
4. pages - app pages

### 5.3 Backend

#### 5.3.1 Technologies

1. [Fastify](https://fastify.dev/) — a backend framework
2. [Knex](https://knexjs.org/) — a query builder
3. [Objection](https://vincit.github.io/objection.js/) — an ORM

#### 5.3.2 Folder Structure

1. db - database data (migrations, seeds)
2. libs - shared libraries and utilities

   2.1 enums

   2.2 exceptions

   2.3 helpers

   2.4 modules - separate features or functionalities

   2.5 types

3. modules - separate app features or functionalities

4. scripts - manually run maintenance entry points (`embeddings:backfill`)

### 5.4 Shared Package

#### 5.4.1 Reason

As we are already using js on both frontend and backend it would be useful to share some contracts and code between them.

#### 5.4.2 Technologies

1. [Zod](https://github.com/colinhacks/zod) — a schema validator

## 6. How to Run

### 6.1 Manually

1. Create and fill all .env files. These files are:

- apps/frontend/.env
- apps/backend/.env

You should use .env.example files as a reference.

1. Install dependencies: `pnpm install`. Git hooks are installed as part of it, they are used to verify code style on
   commit.

2. Run database (PostgreSQL). The migrations enable the [pgvector](https://github.com/pgvector/pgvector) extension, so it has to be available to the server before step 3; `migrate:dev` then runs `CREATE EXTENSION` itself and no manual SQL is needed. Choose one option:

   Option A: Docker Compose

   Prerequisites: Docker Desktop (Windows/macOS) or Docker Engine with the Compose plugin (Linux). The compose file in `apps/backend` starts `pgvector/pgvector:pg18` with the `DB_*` values from `apps/backend/.env`:

   - Start: `pnpm db:up`
   - Stop: `pnpm db:down`

   Option B: native PostgreSQL install

   Install PostgreSQL 18.x, create a database and credentials matching `apps/backend/.env` (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`), and make pgvector available:

   - Homebrew: `brew install pgvector`, then restart the postgresql service.
   - Postgres.app ships pgvector; nothing to do.
   - Other installations: follow the [pgvector installation notes](https://github.com/pgvector/pgvector#installation).

   If you already have a database from before pgvector was required, only the extension is missing. For a native installation, install it as above; the data stays. A Docker container from the plain `postgres` image has to be replaced: remove it with `docker rm -f <container-name>` and run `pnpm db:up`. The compose volume starts empty, so the migrations rebuild the schema and local data is lost.

3. Apply migrations: `pnpm --filter @promptomat/backend migrate:dev`

4. Run backend: `pnpm --filter @promptomat/backend start:dev`

   To repair the embedded prompt index — prompts with no Embedding, changed text, or a changed embedding model — run
   `pnpm --filter @promptomat/backend embeddings:backfill`. The run is idempotent: it reports how many prompts it
   embedded, skipped, and failed, and a repeated run embeds nothing.

5. Run frontend: `pnpm --filter @promptomat/frontend start:dev`

Note that pnpm uses `--filter <package-name>` to target a single workspace, while `-w` is a shorthand for
`--workspace-root` and runs the script of the root `package.json`.

### 6.2 Worktrees

`git worktree add` checks out tracked files only, so a new worktree starts without the `.env` files and without
`node_modules`. Both are handled automatically:

- a `post-checkout` hook copies the gitignored env files from the main working tree, and only when the checkout creates
  a new working tree;
- the first `pnpm` script installs the dependencies, because `verifyDepsBeforeRun` is enabled. Packages are hardlinked
  from the global pnpm store, so nothing is downloaded again.

The hook is installed by `pnpm install` together with the other git hooks, and lives in
`scripts/git-hook-post-checkout.sh`.

The env files are copied as they are, so every worktree shares one database and one backend port. Branches that add
migrations therefore diverge from the shared schema, and two backends cannot run at once. Point a worktree at its own
database and port by editing its copied `.env` when that becomes a problem.

## 7. Development Flow

### 7.1 Pull Request Flow

```
<type>: <ticket-title> <project-prefix>-<issue-number>
```

For the full list of types check [Conventional Commits](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional)

Examples:

- `feat: add dashboard screen pm-123`

### 7.2 Branch Flow

```
<issue-number>-<type>-<short-desc>
```

Examples:

- `123-feat-add-dashboard`
- `12-feat-add-user-flow`
- `34-fix-user-flow`

### 7.3 Commit Flow

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0) to handle commit messages

```
<type>: <description> <project-prefix>-<issue-number>
```

Examples:

- `feat: add dashboard component pm-45`
- `fix: update dashboard card size pm-212`

## 8. Deployment

CI/CD implemented using [GitHub Actions](https://docs.github.com/en/actions)
