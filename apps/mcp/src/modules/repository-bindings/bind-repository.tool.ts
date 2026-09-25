import { ToolName } from "~/libs/enums/enums.js";
import { createMCPTextResult } from "~/libs/helpers/helpers.js";
import { type Tool } from "~/libs/types/types.js";

import { BIND_REPOSITORY_DESCRIPTION } from "./libs/constants/constants.js";
import { RemoteDetectionStatus } from "./libs/enums/enums.js";
import {
	detectRepositoryRemote,
	detectStackTagsFromPackageJson,
	readPackageJson,
} from "./libs/helpers/helpers.js";
import { type BindRepositoryArguments } from "./libs/types/types.js";
import { bindRepositoryInputSchema } from "./libs/validation-schemas/validation-schemas.js";
import { type RepositoryBindingApi } from "./repository-binding-api.js";

const createBindRepositoryTool = (
	repositoryBindingApi: RepositoryBindingApi,
): Tool => ({
	description: BIND_REPOSITORY_DESCRIPTION,
	execute: async (arguments_) => {
		const { remoteName, workspaceId } = arguments_ as BindRepositoryArguments;

		const projectDirectory = process.cwd();
		const detection = await detectRepositoryRemote(
			projectDirectory,
			remoteName,
		);

		if (detection.status === RemoteDetectionStatus.NONE) {
			return createMCPTextResult(
				"This directory has no git remote that could be identified as a repository. Binding is not possible without one.",
			);
		}

		if (detection.status === RemoteDetectionStatus.AMBIGUOUS) {
			return createMCPTextResult(
				`This directory's git remotes point to more than one distinct repository: ${detection.remoteNames.join(", ")}. Call ${ToolName.BIND_REPOSITORY} again with remoteName set to one of them.`,
			);
		}

		const { remoteUrl } = detection;

		const packageJsonContent = await readPackageJson(projectDirectory);
		const stackTags = packageJsonContent
			? detectStackTagsFromPackageJson(packageJsonContent)
			: [];

		await repositoryBindingApi.create({ remoteUrl, stackTags, workspaceId });

		return createMCPTextResult(
			`Bound this repository to workspace id ${String(workspaceId)}.`,
		);
	},
	inputSchema: bindRepositoryInputSchema,
	name: ToolName.BIND_REPOSITORY,
});

export { createBindRepositoryTool };
