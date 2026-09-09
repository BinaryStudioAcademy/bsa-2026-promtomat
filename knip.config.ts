import { type KnipConfig } from "knip";

const config: KnipConfig = {
	ignoreIssues: {
		// Ignoring the bedrock files below also hides the sole import of
		// `ApplicationError`: `TextGenerationError` extends it, and nothing
		// else in the repository references it.
		"apps/backend/src/libs/exceptions/exceptions.ts": ["exports"],
		// the bedrock module is currently not consumed
		"apps/backend/src/libs/modules/bedrock/**": ["files"],
		// the generator module is currently not consumed
		"apps/backend/src/libs/modules/generator/**": ["files"],
		// `PromptEmbeddingSource` and `NearestPrompt` are exported ahead of their
		// consumers: the editing flow (regenerate) and search (#77).
		"apps/backend/src/modules/prompt-embeddings/prompt-embeddings.ts": [
			"types",
		],
		// Overlay mechanism for later consumer tickets (#14, #22, #68, #70).
		// Nothing in the app opens a modal or confirmation in this change.
		"apps/frontend/src/libs/components/confirmation/**": ["files"],
		"apps/frontend/src/libs/components/modal/**": ["files"],
		"apps/frontend/src/libs/components/overlay-host/libs/hooks/use-overlay-host.hook.ts":
			["exports"],
		"apps/frontend/src/libs/components/overlay-host/overlay-host.tsx": [
			"exports",
		],
		// `isValidationError` is exported ahead of its consumer: routing server
		// validation details onto form fields lands in a follow-up change.
		"apps/frontend/src/libs/modules/api/libs/helpers/is-server-error.helper.ts":
			["exports"],
		// Public contracts of the shared package. These predate the RTK Query
		// migration and are published for consumers that do not exist yet.
		"packages/shared/src/**": ["exports", "types"],
	},
	prettier: ["./prettier.config.js"],
	stylelint: ["./stylelint.config.ts"],
	workspaces: {
		".": {},
		"apps/backend": {
			entry: ["src/db/migrations/*.ts"],
			// The AWS SDK is imported only from the ignored bedrock files, so
			// knip cannot see that usage. knex resolves its driver at runtime
			// from `DB_DIALECT`, so nothing imports `pg` either; removing it
			// makes knex throw on the first connection.
			ignoreDependencies: ["@aws-sdk/client-bedrock-runtime", "pg"],
		},
		"apps/frontend": {
			entry: ["src/libs/hooks/**/*.hook.ts"],
		},
		"packages/shared": {
			includeEntryExports: true,
		},
	},
};

export default config;
