/** @type {import('lint-staged').Config} */
const config = {
	"*": [
		() => "pnpm --workspace-root run lint:editor",
		() => "pnpm --workspace-root run lint:fs",
		() => "pnpm --workspace-root run lint:trash",
		() => "pnpm --workspace-root run lint:format",
	],
};

export default config;
