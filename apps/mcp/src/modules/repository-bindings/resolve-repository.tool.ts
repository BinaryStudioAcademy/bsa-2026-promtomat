import { ToolName } from "~/libs/enums/enums.js";
import { createMCPTextResult } from "~/libs/helpers/helpers.js";
import { type Tool } from "~/libs/types/types.js";

import { RESOLVE_REPOSITORY_DESCRIPTION } from "./libs/constants/constants.js";
import {
	RemoteDetectionStatus,
	RepositoryBindingResolutionStatus,
} from "./libs/enums/enums.js";
import { detectRepositoryRemote } from "./libs/helpers/helpers.js";
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

		const detection = await detectRepositoryRemote(process.cwd(), remoteName);

		if (detection.status === RemoteDetectionStatus.NONE) {
			return createMCPTextResult(
				"This directory has no git remote that could be identified as a repository.",
			);
		}

		if (detection.status === RemoteDetectionStatus.AMBIGUOUS) {
			return createMCPTextResult(
				`This directory's git remotes point to more than one distinct repository: ${detection.remoteNames.join(", ")}. Call ${ToolName.RESOLVE_REPOSITORY} again with remoteName set to one of them.`,
			);
		}

		const resolution = await repositoryBindingApi.resolve(
			detection.remoteUrl,
		);

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
	inputSchema: resolveRepositoryInputSchema,
	name: ToolName.RESOLVE_REPOSITORY,
});

export { createResolveRepositoryTool };
