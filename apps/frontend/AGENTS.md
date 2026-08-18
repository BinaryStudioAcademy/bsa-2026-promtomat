# Frontend guidelines

Follow the repository-level `../../AGENTS.md` workflow in addition to these frontend-specific rules.

## Architecture

Follow the existing responsibilities:

- Pages in `src/pages` compose screens and coordinate feature behavior.
- Components render UI and handle local interaction. Shared ones live in `src/libs/components`, page-specific ones in
  the `components` directory of the owning page.
- Modules in `src/modules/<feature>` contain feature APIs and feature-specific code.
- `src/libs` contains reusable application infrastructure.
- `@promptomat/shared` provides cross-application contracts and validation.

Feature-local types, enums, helpers, and constants live under a `libs` directory inside the owning feature or component.

## State and data

- Use RTK Query for server state, requests, caching, and invalidation.
- Do not duplicate RTK Query data in component state or add manual API fetching with `useEffect`.
- Keep temporary UI state local unless it is genuinely shared.
- Use React Hook Form and existing validation schemas for forms.
- Keep narrow adapter exports that re-export `@promptomat/shared` contracts.
- Import internal frontend implementations directly rather than creating broad barrel exports.

## User interface

- Reuse existing components and styles where appropriate.
- Use semantic HTML and accessible labels.
- Preserve keyboard interaction.
- Handle relevant loading, error, empty, and success states.
- Avoid unrelated layout or visual changes.

## Verification

Run:

- `pnpm --filter @promptomat/frontend lint`
- `pnpm --filter @promptomat/frontend build`

These do not cover formatting, file naming, or unused code. Finish with the repository-root checks described in
`../../AGENTS.md`.

For UI changes, identify the route, interaction, and important states that should be checked manually.
