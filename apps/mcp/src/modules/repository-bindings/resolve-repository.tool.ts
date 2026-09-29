import { ToolName } from "~/libs/enums/enums.js";
import { createMCPTextResult } from "~/libs/helpers/helpers.js";
import { type Tool } from "~/libs/types/types.js";

import { RESOLVE_REPOSITORY_DESCRIPTION } from "./libs/constants/constants.js";
import { WorkspaceResolutionStatus } from "./libs/enums/enums.js";
import { resolveWorkspace } from "./libs/helpers/helpers.js";
import {
	type RepositoryBindingCandidateWorkspace,
	type ResolveRepositoryArguments,
} from "./libs/types/types.js";
import { resolveRepositoryInputSchema } from "./libs/validation-schemas/validation-schemas.js";
import { type RepositoryBindingApi } from "./repository-binding-api.js";

const formatWorkspaceList = (
	workspaces: RepositoryBindingCandidateWorkspace[],
): string =>
	workspaces
		.map((workspace) => `${String(workspace.id)}: ${workspace.name}`)
		.join(", ");

const createResolveRepositoryTool = (
	repositoryBindingApi: RepositoryBindingApi,
): Tool => ({
	description: RESOLVE_REPOSITORY_DESCRIPTION,
	execute: async (arguments_) => {
		const { remoteName } = arguments_ as ResolveRepositoryArguments;

		const resolution = await resolveWorkspace({
			projectDirectory: process.cwd(),
			remoteName,
			repositoryBindingApi,
		});

		switch (resolution.status) {
			case WorkspaceResolutionStatus.REMOTE_AMBIGUOUS: {
				return createMCPTextResult(
					`This directory's git remotes point to more than one distinct repository: ${resolution.remoteNames.join(", ")}. Call ${ToolName.RESOLVE_REPOSITORY} again with remoteName set to one of them.`,
				);
			}

			case WorkspaceResolutionStatus.REMOTE_NONE: {
				return createMCPTextResult(
					"This directory has no git remote that could be identified as a repository.",
				);
			}

			case WorkspaceResolutionStatus.RESOLVED: {
				return createMCPTextResult(
					`Resolved to workspace id ${String(resolution.workspaceId)}.`,
				);
			}

			case WorkspaceResolutionStatus.WORKSPACE_AMBIGUOUS: {
				return createMCPTextResult(
					`This repository is bound to more than one workspace you can use: ${formatWorkspaceList(resolution.workspaces)}. Call ${ToolName.BIND_REPOSITORY} with the workspaceId you want.`,
				);
			}

			case WorkspaceResolutionStatus.WORKSPACE_UNRESOLVED: {
				return createMCPTextResult(
					`This repository is not bound to a workspace yet. Workspaces you can use: ${formatWorkspaceList(resolution.workspaces)}. Call ${ToolName.BIND_REPOSITORY} with the workspaceId to bind it to.`,
				);
			}
		}
	},
	inputSchema: resolveRepositoryInputSchema,
	name: ToolName.RESOLVE_REPOSITORY,
});

export { createResolveRepositoryTool };
