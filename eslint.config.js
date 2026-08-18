import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { resolve as tsResolver } from "eslint-import-resolver-typescript";
import importPlugin, { configs as importConfigs } from "eslint-plugin-import-x";
import jsdocPlugin from "eslint-plugin-jsdoc";
import perfectionist, {
	configs as perfectionistConfigs,
} from "eslint-plugin-perfectionist";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

const JS_MAX_PARAMS_ALLOWED = 3;

/** @typedef {import("eslint").Linter.Config} */
let Config;
/** @typedef {import("eslint").Linter.ParserModule} */
let ParserModule;
/** @typedef {{ message: string, selector: string }} RestrictedSyntaxOption */

// Shared across every workspace: packages extend this list instead of
// re-declaring it, since ESLint replaces rule options rather than merging them.
/** @type {RestrictedSyntaxOption[]} */
const restrictedSyntaxOptions = [
	{
		message: "Export/Import all (*) is forbidden.",
		selector: "ExportAllDeclaration,ImportAllDeclaration",
	},
	{
		message: "Exports should be at the end of the file.",
		selector: "ExportNamedDeclaration[declaration!=null]",
	},
	{
		message: "TS features are forbidden",
		selector: "TSEnumDeclaration,ClassDeclaration[abstract=true]",
	},
];

/** @type {Config} */
const filesConfig = {
	files: ["**/*.{js,ts,tsx}"],
};

/** @type {Config} */
const ignoresConfig = {
	ignores: ["apps", "packages", "dangerfile.ts"],
};

/** @type {Config} */
const jsConfig = {
	languageOptions: {
		globals: globals.node,
		parserOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
		},
	},
	rules: {
		...js.configs.recommended.rules,
		"arrow-parens": ["error", "always"],
		curly: ["error", "all"],
		"max-params": ["error", JS_MAX_PARAMS_ALLOWED],
		"no-console": ["error"],
		"no-multiple-empty-lines": [
			"error",
			{
				max: 1,
			},
		],
		"no-restricted-syntax": ["error", ...restrictedSyntaxOptions],
		quotes: ["error", "double"],
	},
};

/** @type {Config} */
const importConfig = {
	plugins: {
		"import-x": importPlugin,
	},
	rules: {
		...importConfigs.recommended.rules,
		"import-x/exports-last": ["error"],
		"import-x/extensions": [
			"error",
			{
				js: "ignorePackages",
			},
		],
		"import-x/newline-after-import": ["error"],
		"import-x/no-default-export": ["error"],
		"import-x/no-duplicates": ["error"],
	},
	settings: {
		"import-x/parsers": {
			espree: [".js", ".cjs"],
		},
		"import-x/resolver": {
			"node": {
				"extensions": [".js", ".ts", ".tsx"],
			},
			typescript: tsResolver,
		},
	},
};

/** @type {Config} */
const sonarConfig = {
	plugins: {
		sonarjs,
	},
	rules: {
		...sonarjs.configs.recommended.rules,
		"sonarjs/no-hardcoded-passwords": "off",
		"sonarjs/todo-tag": "off",
	},
};

/** @type {Config} */
const unicornConfig = {
	plugins: {
		unicorn,
	},
	rules: {
		...unicorn.configs.recommended.rules,
		// Class member order is already governed by the project's explicit
		// perfectionist/sort-classes groups configuration below; the two
		// rules disagree on ordering, so defer to perfectionist.
		"unicorn/consistent-class-member-order": ["off"],
		"unicorn/name-replacements": [
			"error",
			{
				replacements: {
					application: false,
					applications: false,
					repositories: false,
					repository: false,
				},
			},
		],
		"unicorn/no-null": ["off"],
	},
};

/** @type {Config} */
const perfectionistConfig = {
	plugins: {
		perfectionist,
	},
	rules: {
		...perfectionistConfigs["recommended-natural"].rules,
		"perfectionist/sort-classes": [
			"error",
			{
				groups: [
					"index-signature",
					// properties
					["static-property", "static-accessor-property"],
					["protected-static-property", "protected-static-accessor-property"],
					["private-static-property", "private-static-accessor-property"],
					["private-property", "private-accessor-property"],
					["public-property", "public-accessor-property"],
					["property", "accessor-property"],

					"constructor",
					// getters-setters
					["static-get-method", "static-set-method"],
					["protected-static-get-method", "protected-static-set-method"],
					["private-static-get-method", "private-static-set-method"],
					["public-static-get-method", "public-static-set-method"],
					["protected-get-method", "protected-set-method"],
					["private-get-method", "private-set-method"],
					["get-method", "set-method"],

					"static-block",

					//methods
					["static-method", "static-function-property"],
					["protected-static-method", "protected-static-function-property"],
					["private-static-method", "private-static-function-property"],
					["protected-method", "protected-function-property"],
					["private-method", "private-function-property"],
					["public-method", "public-function-property"],

					"unknown",
				],
			},
		],
		"perfectionist/sort-named-exports": [
			"error",
			{
				groups: ["type-export", "value-export"],
			},
		],
	},
};

/** @type {Config} */
const typescriptConfig = {
	files: ["**/*.ts", "**/*.tsx"],
	languageOptions: {
		parser: /** @type {ParserModule} */ (tsParser),
		parserOptions: {
			project: "./tsconfig.json",
		},
	},
	plugins: {
		"@typescript-eslint": ts,
	},
	rules: {
		...ts.configs["strict-type-checked"].rules,
		"@typescript-eslint/no-magic-numbers": [
			"error",
			{
				ignoreEnums: true,
				ignoreReadonlyClassProperties: true,
			},
		],
		"@typescript-eslint/no-unnecessary-type-parameters": "off",
		"@typescript-eslint/return-await": ["error", "always"],
	},
};

/** @type {Config} */
const jsdocConfig = {
	files: ["eslint.config.js", "lint-staged.config.js"],
	plugins: {
		jsdoc: jsdocPlugin,
	},
	rules: {
		...jsdocPlugin.configs["recommended-typescript-flavor-error"].rules,
		"jsdoc/no-undefined-types": ["error"],
	},
};

/** @type {Config[]} */
const overridesConfigs = [
	{
		files: [
			"commitlint.config.ts",
			"prettier.config.js",
			"stylelint.config.ts",
			"knip.config.ts",
			"packages.d.ts",
			"lint-staged.config.js",
			"eslint.config.js",
		],
		rules: {
			"import-x/no-default-export": ["off"],
		},
	},
];

/** @type {Config[]} */
const config = [
	filesConfig,
	ignoresConfig,
	jsConfig,
	importConfig,
	sonarConfig,
	unicornConfig,
	perfectionistConfig,
	typescriptConfig,
	jsdocConfig,
	...overridesConfigs,
];

export default config;
export { restrictedSyntaxOptions };
