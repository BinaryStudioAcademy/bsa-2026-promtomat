import baseConfig from "../../eslint.config.js";

/** @typedef {import("eslint").Linter.Config} */
let Config;

const REPOSITORY_METHOD_PREFIX = "^(create|delete|find|update)";

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
	{
		files: ["src/**/*.ts"],
		rules: {
			"no-restricted-syntax": [
				"error",
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
				{
					message:
						"Repository methods start with create, delete, find or update (findAll, findByEmail) - not get*, fetch* or persist*.",
					selector: `ClassDeclaration[id.name=/Repository$/] > ClassBody > MethodDefinition[kind="method"][static=false][accessibility!="private"][accessibility!="protected"][key.name!=/${REPOSITORY_METHOD_PREFIX}/]`,
				},
				{
					message:
						"Repository port methods start with create, delete, find or update (findAll, findByEmail) - not get*, fetch* or persist*.",
					selector: `:matches(TSInterfaceDeclaration, TSTypeAliasDeclaration)[id.name=/Repository$/] TSMethodSignature[key.name!=/${REPOSITORY_METHOD_PREFIX}/]`,
				},
			],
		},
	},
];

/** @type {Config[]} */
const config = [...baseConfig, ignoresConfig, ...overridesConfigs];

export default config;
