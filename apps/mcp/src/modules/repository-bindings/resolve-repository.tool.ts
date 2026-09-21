import { ToolName } from "~/libs/enums/enums.js";
import { createTextResult } from "~/libs/helpers/helpers.js";
import { type Tool } from "~/libs/types/types.js";

import { getRepositoryRemoteUrl } from "./libs/helpers/helpers.js";
import { type RepositoryBindingApi } from "./repository-binding-api.js";

const DESCRIPTION =
	"Check which Promptomat workspace this checkout is bound to, by reading its git remote. Call it before composing or searching prompts, to know the current workspace. If the result is unresolved or ambiguous, call bind-repository with the workspaceId to bind. Takes no arguments.";

const createResolveRepositoryTool = (
	repositoryBindingApi: RepositoryBindingApi,
): Tool => ({
	description: DESCRIPTION,
	execute: async () => {
		const remoteUrl = await getRepositoryRemoteUrl(process.cwd());

		if (!remoteUrl) {
			return createTextResult(
				"This directory has no git remote named 'origin', so it cannot be identified as a repository.",
			);
		}

		const resolution = await repositoryBindingApi.resolve(remoteUrl);

		if (resolution.status === "resolved") {
			return createTextResult(
				`Resolved to workspace id ${String(resolution.workspaceId)}.`,
			);
		}

		if (resolution.status === "ambiguous") {
			const workspaceList = resolution.workspaces
				.map((workspace) => `${String(workspace.id)}: ${workspace.name}`)
				.join(", ");

			return createTextResult(
				`This repository is bound to more than one workspace you can use: ${workspaceList}. Call bind-repository with the workspaceId you want.`,
			);
		}

		return createTextResult(
			"This repository is not bound to any workspace yet. Call bind-repository with the workspaceId it belongs to.",
		);
	},
	name: ToolName.RESOLVE_REPOSITORY,
});

export { createResolveRepositoryTool };
