import { ToolName } from "~/libs/enums/enums.js";

const SERVER_INSTRUCTIONS = `Promptomat keeps a corpus of prompts organised in workspaces. Every tool of this server acts as the Promptomat user who issued the API token the server was started with. Call ${ToolName.WHO_AM_I} to verify the connection and the token before relying on the other tools.`;

export { SERVER_INSTRUCTIONS };
