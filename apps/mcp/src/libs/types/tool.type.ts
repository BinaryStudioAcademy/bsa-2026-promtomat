import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";

type Tool = {
	description: string;
	execute: () => Promise<CallToolResult>;
	name: string;
};

export { type Tool };
