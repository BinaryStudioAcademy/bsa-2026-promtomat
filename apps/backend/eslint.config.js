import baseConfig from "../../eslint.config.js";

/** @typedef {import("eslint").Linter.Config} */
let Config;

/** @type {Config} */
const ignoresConfig = {
	ignores: ["build"],
};

/** @type {Config[]} */
const overridesConfigs = [
	{
		files: ["knexfile.ts"],
		rules: {
			"import-x/no-default-export": ["off"],
		},
	},
	{
		files: ["src/db/migrations/**/*.ts"],
		rules: {
			"unicorn/filename-case": [
				"error",
				{
					case: "snakeCase",
				},
			],
		},
	},
];

/** @type {Config[]} */
const config = [...baseConfig, ignoresConfig, ...overridesConfigs];

export default config;
