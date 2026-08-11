import baseConfig from "../../lint-staged.config.js";

/** @type {import('lint-staged').Config} */
const config = {
	...baseConfig,
	"**/*.css": [() => "npm run lint:css -w apps/frontend"],
	"**/*.{ts,tsx}": [() => "npm run lint:js", () => "npm run lint:type"],
};

export default config;
