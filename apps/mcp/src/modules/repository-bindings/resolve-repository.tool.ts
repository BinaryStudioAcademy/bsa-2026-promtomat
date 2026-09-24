import { ToolName } from "~/libs/enums/enums.js";
import { createMCPTextResult } from "~/libs/helpers/helpers.js";
import { type Tool } from "~/libs/types/types.js";

import { RESOLVE_REPOSITORY_DESCRIPTION } from "./libs/constants/constants.js";
import { RepositoryBindingResolutionStatus } from "./libs/enums/enums.js";
import { getRepositoryRemoteUrl } from "./libs/helpers/helpers.js";
import { type RepositoryBindingApi } from "./repository-binding-api.js";

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
			const workspaceList = resolution.workspaces
				.map((workspace) => `${String(workspace.id)}: ${workspace.name}`)
				.join(", ");

			return createMCPTextResult(
				`This repository is bound to more than one workspace you can use: ${workspaceList}. Call bind-repository with the workspaceId you want.`,
			);
		}

		return createMCPTextResult(
			"This repository is not bound to any workspace yet. Call bind-repository with the workspaceId it belongs to.",
		);
	},
	name: ToolName.RESOLVE_REPOSITORY,
});

export { createResolveRepositoryTool };
