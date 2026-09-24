import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";

const createMCPTextResult = (text: string): CallToolResult => ({
	content: [{ text, type: "text" }],
});

export { createMCPTextResult };
