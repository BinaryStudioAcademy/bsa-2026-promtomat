import packageManifest from "../../../package.json" with { type: "json" };

const ServerIdentity = {
	COMMAND: "promptomat-mcp",
	NAME: "promptomat",
	VERSION: packageManifest.version,
} as const;

export { ServerIdentity };
