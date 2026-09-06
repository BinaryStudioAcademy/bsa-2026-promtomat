import { type KnipConfig } from "knip";

const config: KnipConfig = {
	ignoreIssues: {
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
			ignoreDependencies: ["pg"],
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
