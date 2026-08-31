# Code conventions

The rules a change in this repository has to satisfy. Written for anyone working in the code — the student, an
assistant implementing a change, and the automated pull request review. `AGENTS.md` imports this file; the review
workflow reads it directly.

## Project structure

This is a pnpm workspace using Node.js 24 and pnpm 11.

- `apps/backend` — Fastify backend
- `apps/frontend` — React frontend
- `packages/shared` — shared contracts and validation

Within an app, `src/libs` holds reusable infrastructure and `src/modules` holds features; the frontend adds `src/pages`.
Sections 5.2.2 and 5.3.2 of `readme.md` document the folder layout in full.

A declaration lives in the file its role names. A type goes in a `*.type.ts`, a constant object in a `*.enum.ts`, a
query in a `*.repository.ts`, a set of error messages in an enum of its own — not alongside the module that happens to
use it. `ls-lint` checks that file names are well formed; nothing checks that the contents match the name.

Layers do not borrow each other's work. A controller maps a request to one service call and a response: branching,
data assembly, and any check beyond the route's validation schema belong in the service, and queries belong in the
repository. A guard or plugin that has already resolved something puts it on the request; the controller reads it
rather than resolving it again.

## Linting

ESLint runs with `--max-warnings=0`, so a style violation fails the check. Several rules reject common defaults, so read
a neighboring file before writing a new one.

## Exports and imports

- Exports go at the end of the file. Write `const value = …;` and then `export { value };`, never
  `export const value = …`.
- No default exports.
- No `export *` and no `import * as`. Re-export names explicitly.
- Relative imports carry the `.js` extension, including in `.tsx` files, as in `./libs/enums/enums.js`.
- Cross-tree imports use the `~/*` alias. Imports within the same feature stay relative.
- Type imports use the inline modifier, as in `import { type UserDto } from "…";`.
- Do not import `@promptomat/shared` directly. A `libs/**` barrel re-exports what the app needs — `libs/enums/enums.ts`,
  `libs/types/types.ts`, a feature's `libs/validation-schemas/validation-schemas.ts` — and every other file imports from
  that barrel. A controller, service, repository, component or hook naming `@promptomat/shared` in its import list is a
  defect even though nothing fails to compile.

## Language

- No TypeScript `enum` and no abstract classes. Use a constant object instead, as in
  `const AppRoute = { ROOT: "/" } as const;`.
- No magic numbers. Name them, as in `HTTPCode.OK` rather than `200`.
- No `console`. The backend has a logger module.
- At most three parameters per function. Pass an options object beyond that.
- TypeScript runs `strict-type-checked` with `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and
  `noPropertyAccessFromIndexSignature`, so indexed access is possibly `undefined` and an optional property is not
  interchangeable with `undefined`.
- `sonarjs` is enabled, so avoid duplicated string literals and deeply nested conditionals.

## Naming

- Files and directories are kebab-case with a role suffix: `*.type.ts`, `*.enum.ts`, `*.helper.ts`, `*.hook.ts`,
  `*.module.ts`, `*.model.ts`, `*.controller.ts`, `*.service.ts`, `*.repository.ts`. Backend migrations are snake_case.
- Abbreviations are rejected: `properties` not `props`, `request` and `response` not `req` and `res`, `error` not `err`.
  React component prop types are named `Properties`.

## Ordering

- Imports, object keys, type members, union members, named exports, and class members are sorted in natural order.
- Sorting and formatting are auto-fixable. Run `pnpm format` at the root and
  `pnpm --filter <workspace> exec eslint . --fix` for the workspace you changed instead of sorting by hand. The rules
  above are not auto-fixable and have to be written correctly.

## Frontend only

- Do not pass inline functions to JSX props. Hoist the handler or wrap it in `useCallback`.
- The `jsx-a11y` recommended rules are enforced.
