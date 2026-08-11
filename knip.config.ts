import { type KnipConfig } from "knip";

const config: KnipConfig = {
	prettier: ["./prettier.config.js"],
	stylelint: ["./stylelint.config.ts"],
	workspaces: {
		".": {},
		"apps/backend": {
			entry: ["src/db/migrations/*.ts"],
			ignoreDependencies: ["pg"],
		},
		"apps/frontend": {},
		"packages/shared": {
			includeEntryExports: true,
		},
	},
};

export default config;
