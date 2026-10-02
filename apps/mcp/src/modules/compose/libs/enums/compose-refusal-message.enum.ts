import { ToolName } from "~/libs/enums/enums.js";

const ComposeRefusalMessage = {
	REMOTE_AMBIGUOUS: (remoteNames: string[]): string =>
		`No prompt was composed, because this directory's git remotes point to more than one distinct repository: ${remoteNames.join(", ")}. Call ${ToolName.COMPOSE_PROMPT} again with remoteName set to one of them.`,
	REMOTE_NONE: `No prompt was composed, because this directory has no git remote that could be identified as a repository. Add one before calling ${ToolName.COMPOSE_PROMPT} again.`,
	WORKSPACE_AMBIGUOUS: `No prompt was composed, because this repository is bound to more than one workspace you can use, so Promptomat cannot tell which one this task belongs to. Call ${ToolName.RESOLVE_REPOSITORY} to see them. Ask the user which workspace to keep. The repository then has to be removed from the other workspaces in Promptomat by each workspace's owner, because only the owner can remove a binding, and it cannot be removed from here. Then call ${ToolName.COMPOSE_PROMPT} again.`,
	WORKSPACE_NOT_BOUND: `No prompt was composed, because this repository is not bound to a workspace yet. Call ${ToolName.RESOLVE_REPOSITORY} to see the workspaces you can bind it to, then call ${ToolName.BIND_REPOSITORY} with the workspaceId you want. Then call ${ToolName.COMPOSE_PROMPT} again.`,
} as const;

export { ComposeRefusalMessage };
