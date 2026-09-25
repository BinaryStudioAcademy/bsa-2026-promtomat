import { ToolName } from "~/libs/enums/enums.js";

const BIND_REPOSITORY_DESCRIPTION = `Bind this checkout's repository to a Promptomat workspace, so future tool calls resolve to it. Call it after ${ToolName.RESOLVE_REPOSITORY} reports the checkout as unresolved or ambiguous, passing the workspaceId to bind to. Pass remoteName only if a prior call reported more than one distinct repository among the configured remotes. Detects the project's technologies from package.json and records them on the workspace.`;

export { BIND_REPOSITORY_DESCRIPTION };
