import { MCPEnvironmentVariable, MCPSetup } from "../enums/enums.js";
import { type MCPConnectCommandParameters } from "../types/types.js";
import { quoteShellValue } from "./quote-shell-value.helper.js";

const getEnvironmentOption = (name: string, value: string): string => {
	return `-e ${name}=${quoteShellValue(value)}`;
};

const getMCPConnectCommand = ({
	apiUrl,
	token,
}: MCPConnectCommandParameters): string => {
	const apiUrlOption = getEnvironmentOption(
		MCPEnvironmentVariable.API_URL,
		apiUrl,
	);
	const tokenOption = getEnvironmentOption(
		MCPEnvironmentVariable.API_TOKEN,
		token,
	);

	return `claude mcp add --scope user ${MCPSetup.SERVER_KEY} ${apiUrlOption} ${tokenOption} -- ${MCPSetup.SERVER_COMMAND}`;
};

export { getMCPConnectCommand };
