import { ToolName } from "~/libs/enums/enums.js";

const RESOLVE_REPOSITORY_DESCRIPTION = `Check which Promptomat workspace this checkout is bound to, by reading its git remotes. Call it before composing or searching prompts, to know the current workspace. Pass remoteName only if a prior call reported more than one distinct repository among the configured remotes. If the result is unresolved or ambiguous, call ${ToolName.BIND_REPOSITORY} with the workspaceId to bind.`;

export { RESOLVE_REPOSITORY_DESCRIPTION };
