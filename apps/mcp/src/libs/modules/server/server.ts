import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { whoAmITool } from "~/modules/auth/auth.js";
import {
	bindRepositoryTool,
	resolveRepositoryTool,
} from "~/modules/repository-bindings/repository-bindings.js";

import { StdioServer } from "./stdio-server.module.js";

const server = new StdioServer({
	apiUrl: config.ENV.API.URL,
	logger,
	tools: [whoAmITool, resolveRepositoryTool, bindRepositoryTool],
});

export { server };
