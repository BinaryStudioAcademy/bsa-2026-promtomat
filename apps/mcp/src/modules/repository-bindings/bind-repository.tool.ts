import { type z } from "zod";

import { ToolName } from "~/libs/enums/enums.js";
import { createMCPTextResult } from "~/libs/helpers/helpers.js";
import { type Tool } from "~/libs/types/types.js";

import { BIND_REPOSITORY_DESCRIPTION } from "./libs/constants/constants.js";
import {
	detectStackTagsFromPackageJson,
	getRepositoryRemoteUrl,
	readPackageJson,
} from "./libs/helpers/helpers.js";
import { bindRepositoryInputSchema } from "./libs/validation-schemas/validation-schemas.js";
import { type RepositoryBindingApi } from "./repository-binding-api.js";

const createBindRepositoryTool = (
	repositoryBindingApi: RepositoryBindingApi,
): Tool => ({
	description: BIND_REPOSITORY_DESCRIPTION,
	execute: async (arguments_) => {
		const { workspaceId } = arguments_ as z.infer<
			z.ZodObject<typeof bindRepositoryInputSchema>
		>;

		const projectDirectory = process.cwd();
		const remoteUrl = await getRepositoryRemoteUrl(projectDirectory);

		if (!remoteUrl) {
			return createMCPTextResult(
				"This directory has no git remote named 'origin', so it cannot be identified as a repository. Binding is not possible without one.",
			);
		}

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
