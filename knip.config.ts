import { type KnipConfig } from "knip";

const config: KnipConfig = {
	ignoreIssues: {
		// The embedding contract (status, typed errors, vector types) is exported
		// ahead of its consumers: prompt embeddings (#76) and search (#77).
		"apps/backend/src/libs/modules/embedding/embedding.ts": [
			"exports",
			"types",
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
