import { type ZodRawShapeCompat } from "@modelcontextprotocol/sdk/server/zod-compat.js";
import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";

type Tool = {
	description: string;
	execute: () => Promise<CallToolResult>;
	inputSchema?: ZodRawShapeCompat;
	name: string;
};

export { type Tool };
