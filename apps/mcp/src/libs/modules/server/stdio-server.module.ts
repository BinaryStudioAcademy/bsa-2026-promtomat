import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { ServerIdentity, ToolName } from "~/libs/enums/enums.js";
import {
	createMCPTextResult,
	getErrorDetails,
} from "~/libs/helpers/helpers.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type Tool } from "~/libs/types/types.js";

import { TOOL_CALL_LOG_MESSAGE } from "./libs/constants/constants.js";
import { ToolOutcome } from "./libs/enums/enums.js";
import { getToolFailure } from "./libs/helpers/helpers.js";
import { type Server, type ToolCallLog } from "./libs/types/types.js";

const INSTRUCTIONS = `Promptomat keeps a corpus of prompts organised in workspaces. Every tool of this server acts as the Promptomat user who issued the API token the server was started with. Call ${ToolName.WHO_AM_I} to verify the connection and the token before relying on the other tools.`;

type Constructor = {
	apiUrl: string;
	logger: Logger;
	tools: Tool[];
};

class StdioServer implements Server {
	private apiUrl: string;

	private logger: Logger;

	private mcpServer: McpServer;

	private tools: Tool[];

	public constructor({ apiUrl, logger, tools }: Constructor) {
		this.apiUrl = apiUrl;
		this.logger = logger;
		this.tools = tools;
		this.mcpServer = new McpServer(
			{ name: ServerIdentity.NAME, version: ServerIdentity.VERSION },
			{ instructions: INSTRUCTIONS },
		);
	}

	private async callTool(tool: Tool): Promise<CallToolResult> {
		const startedAt = performance.now();

		try {
			const result = await tool.execute();

			this.logToolCall({
				outcome: ToolOutcome.OK,
				startedAt,
				toolName: tool.name,
			});

			return result;
		} catch (error) {
			const { outcome, text } = getToolFailure({
				apiUrl: this.apiUrl,
				error,
				toolName: tool.name,
			});

			this.logToolCall({ error, outcome, startedAt, toolName: tool.name });

			return { ...createMCPTextResult(text), isError: true };
		}
	}

	private logToolCall({
		error,
		outcome,
		startedAt,
		toolName,
	}: ToolCallLog): void {
		const parameters = {
			durationMs: Math.round(performance.now() - startedAt),
			outcome,
			tool: toolName,
		};

		if (outcome === ToolOutcome.OK) {
			this.logger.info(TOOL_CALL_LOG_MESSAGE, parameters);

			return;
		}

		this.logger.error(TOOL_CALL_LOG_MESSAGE, {
			...parameters,
			error: getErrorDetails(error),
		});
	}

	private registerTool(tool: Tool): void {
		this.mcpServer.registerTool(
			tool.name,
			{ description: tool.description },
			async () => await this.callTool(tool),
		);
	}

	public async start(): Promise<void> {
		for (const tool of this.tools) {
			this.registerTool(tool);
		}

		await this.mcpServer.connect(new StdioServerTransport());
		this.logger.info("Server started", {
			apiUrl: this.apiUrl,
			name: ServerIdentity.NAME,
			version: ServerIdentity.VERSION,
		});
	}

	public async stop(): Promise<void> {
		await this.mcpServer.close();
	}
}

export { StdioServer };
