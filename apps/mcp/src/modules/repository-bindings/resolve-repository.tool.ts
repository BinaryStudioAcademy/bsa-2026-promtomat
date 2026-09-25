import { ToolName } from "~/libs/enums/enums.js";
import { createMCPTextResult } from "~/libs/helpers/helpers.js";
import { type Tool } from "~/libs/types/types.js";

import { RESOLVE_REPOSITORY_DESCRIPTION } from "./libs/constants/constants.js";
import { RepositoryBindingResolutionStatus } from "./libs/enums/enums.js";
import { getRepositoryRemoteUrl } from "./libs/helpers/helpers.js";
import { type RepositoryBindingCandidateWorkspace } from "./libs/types/types.js";
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
	execute: async () => {
		const remoteUrl = await getRepositoryRemoteUrl(process.cwd());

		if (!remoteUrl) {
			return createMCPTextResult(
				"This directory has no git remote named 'origin', so it cannot be identified as a repository.",
			);
		}

		const resolution = await repositoryBindingApi.resolve(remoteUrl);

		if (resolution.status === RepositoryBindingResolutionStatus.RESOLVED) {
			return createMCPTextResult(
				`Resolved to workspace id ${String(resolution.workspaceId)}.`,
			);
		}

		if (resolution.status === RepositoryBindingResolutionStatus.AMBIGUOUS) {
			return createMCPTextResult(
				`This repository is bound to more than one workspace you can use: ${formatWorkspaceList(resolution.workspaces)}. Call ${ToolName.BIND_REPOSITORY} with the workspaceId you want.`,
			);
		}

		return createMCPTextResult(
			`This repository is not bound to a workspace yet. Workspaces you can use: ${formatWorkspaceList(resolution.workspaces)}. Call ${ToolName.BIND_REPOSITORY} with the workspaceId to bind it to.`,
		);
	},
	name: ToolName.RESOLVE_REPOSITORY,
});

export { createResolveRepositoryTool };
