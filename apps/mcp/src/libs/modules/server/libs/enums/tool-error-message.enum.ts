import { MCPEnvironmentVariable } from "~/libs/enums/enums.js";

const ToolErrorMessage = {
	BACKEND_ERROR: "The Promptomat API answered :status :code (:message).",
	TOKEN_REJECTED: `The Promptomat API rejected the token. Check ${MCPEnvironmentVariable.API_TOKEN} or create a new token in Settings → Security.`,
	UNEXPECTED: "Unexpected error while calling :tool. See the server log.",
	UNEXPECTED_RESPONSE:
		"The Promptomat API at :url answered :status with a body that is not the expected JSON.",
	UNREACHABLE: `The Promptomat API at :url is unreachable (:cause). Check ${MCPEnvironmentVariable.API_URL} and that the backend is running.`,
} as const;

export { ToolErrorMessage };
