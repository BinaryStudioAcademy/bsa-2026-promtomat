import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { ServerIdentity, ToolName } from "~/libs/enums/enums.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type Tool } from "~/libs/types/types.js";

import { type Server } from "./libs/types/types.js";

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

	private registerTool(tool: Tool): void {
		const { description, inputSchema, name } = tool;

		this.mcpServer.registerTool(
			name,
			inputSchema === undefined
				? { description }
				: { description, inputSchema },
			async () => await tool.execute(),
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
