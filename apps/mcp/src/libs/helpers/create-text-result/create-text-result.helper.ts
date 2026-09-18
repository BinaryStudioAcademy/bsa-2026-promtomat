import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";

const createTextResult = (text: string): CallToolResult => ({
	content: [{ text, type: "text" }],
});

export { createTextResult };
