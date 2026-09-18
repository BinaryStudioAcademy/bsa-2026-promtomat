import { MCPEnvironmentVariable } from "~/libs/enums/enums.js";

const ConfigValidationMessage = {
	API_TOKEN_MISSING: `Missing required environment variable ${MCPEnvironmentVariable.API_TOKEN}`,
	API_URL_INVALID: `${MCPEnvironmentVariable.API_URL} must be an absolute http(s) URL`,
	API_URL_MISSING: `Missing required environment variable ${MCPEnvironmentVariable.API_URL}`,
} as const;

export { ConfigValidationMessage };
