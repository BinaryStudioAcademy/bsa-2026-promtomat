import { ToolName } from "~/libs/enums/enums.js";

const ComposeRefusalMessage = {
	REPOSITORY_NOT_IDENTIFIED: `No prompt was composed, because this checkout could not be identified as a single repository: either the directory has no git remote that points to a repository, or its remotes point to more than one distinct repository. Call ${ToolName.RESOLVE_REPOSITORY} to see which. If it reports more than one repository, call ${ToolName.COMPOSE_PROMPT} again with remoteName set to the remote to use. If the directory has no remote at all, add one first, because a repository cannot be bound without it.`,
	WORKSPACE_AMBIGUOUS: `No prompt was composed, because this repository is bound to more than one workspace you can use, so Promptomat cannot tell which one this task belongs to. Call ${ToolName.RESOLVE_REPOSITORY} to see them. Ask the user which workspace to keep, then remove the repository from the other workspaces in their settings in Promptomat, because a binding cannot be removed from here. Then call ${ToolName.COMPOSE_PROMPT} again.`,
	WORKSPACE_NOT_BOUND: `No prompt was composed, because this repository is not bound to a workspace yet. Call ${ToolName.RESOLVE_REPOSITORY} to see the workspaces you can bind it to, then call ${ToolName.BIND_REPOSITORY} with the workspaceId you want. Then call ${ToolName.COMPOSE_PROMPT} again.`,
} as const;

export { ComposeRefusalMessage };
