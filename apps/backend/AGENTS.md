# Backend guidelines

Follow the repository-level `../../AGENTS.md` workflow in addition to these backend-specific rules.

## Architecture

Follow the existing request flow:

`controller -> service -> repository -> entity/model -> database`

- Controllers own routes, request validation, HTTP status codes, and response mapping.
- Services own application and business logic.
- Repositories own persistence queries.
- Models represent database records.
- Entities translate between persistence and application data.
- Shared frontend/backend DTOs and validation schemas belong in `@promptomat/shared`.

Feature code lives in `src/modules/<feature>`. Reusable infrastructure lives in `src/libs`.

## API behavior

- Validate external input at the controller boundary using existing schemas.
- Keep API request and response types explicit.
- Update shared contracts when both applications depend on the behavior.
- Keep OpenAPI documentation consistent with changed endpoints.
- Do not leak stack traces, credentials, password material, or database details in responses.

## Database behavior

- Use the established Objection and Knex abstractions.
- Do not construct SQL by concatenating external input.
- Use transactions when related writes must succeed or fail together.
- Do not modify migrations that may already have been applied.
- A new migration has to account for data conversion, rollback behavior, defaults, nullability, and compatibility with
  existing rows. State how each one is handled.
- Migration files live in `src/db/migrations` and are named in snake_case.

## Verification

Run:

- `pnpm --filter @promptomat/backend lint`
- `pnpm --filter @promptomat/backend build`

These do not cover formatting, file naming, or unused code. Finish with the repository-root checks described in
`../../AGENTS.md`.

For API or database changes, also describe the focused request or database scenario used for manual verification.
