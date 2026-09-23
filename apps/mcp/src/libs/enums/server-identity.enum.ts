import { MCPSetup } from "@promptomat/shared";

import packageManifest from "../../../package.json" with { type: "json" };

const ServerIdentity = {
	COMMAND: MCPSetup.SERVER_COMMAND,
	NAME: MCPSetup.SERVER_KEY,
	VERSION: packageManifest.version,
} as const;

export { ServerIdentity };
