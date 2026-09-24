import { ToolName } from "~/libs/enums/enums.js";

const RESOLVE_REPOSITORY_DESCRIPTION = `Check which Promptomat workspace this checkout is bound to, by reading its git remote. Call it before composing or searching prompts, to know the current workspace. If the result is unresolved or ambiguous, call ${ToolName.BIND_REPOSITORY} with the workspaceId to bind. Takes no arguments.`;

export { RESOLVE_REPOSITORY_DESCRIPTION };
