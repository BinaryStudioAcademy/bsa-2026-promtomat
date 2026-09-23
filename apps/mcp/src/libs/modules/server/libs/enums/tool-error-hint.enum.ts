import { MCPEnvironmentVariable } from "~/libs/enums/enums.js";

const ToolErrorHint = {
	API_URL: `Check that ${MCPEnvironmentVariable.API_URL} is the API base including /api/v1.`,
} as const;

export { ToolErrorHint };
