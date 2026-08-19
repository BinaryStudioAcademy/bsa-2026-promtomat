import baseConfig from "../../lint-staged.config.js";

/** @type {import('lint-staged').Config} */
const config = {
	...baseConfig,
	"**/*.css": [() => "pnpm run lint:css"],
	"**/*.{ts,tsx}": [() => "pnpm run lint:js", () => "pnpm run lint:type"],
};

export default config;
