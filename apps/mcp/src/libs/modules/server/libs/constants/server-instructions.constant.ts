import { ToolName } from "~/libs/enums/enums.js";

const SERVER_INSTRUCTIONS = `Promptomat keeps a corpus of prompts organised in workspaces. Every tool of this server acts as the Promptomat user who issued the API token the server was started with. Call ${ToolName.WHO_AM_I} to verify the connection and the token before relying on the other tools. To get a prompt for a coding task, call ${ToolName.COMPOSE_PROMPT}: it finds the workspace from the git remote of the current directory, so if it reports that the checkout is not bound to a workspace, use ${ToolName.RESOLVE_REPOSITORY} and then ${ToolName.BIND_REPOSITORY} first.`;

export { SERVER_INSTRUCTIONS };
