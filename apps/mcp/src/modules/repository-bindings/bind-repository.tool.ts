import { z } from "zod";

import { ToolName } from "~/libs/enums/enums.js";
import { createTextResult } from "~/libs/helpers/helpers.js";
import { type Tool } from "~/libs/types/types.js";

import {
	detectStackTagsFromPackageJson,
	getRepositoryRemoteUrl,
	readPackageJson,
} from "./libs/helpers/helpers.js";
import { type RepositoryBindingApi } from "./repository-binding-api.js";

const DESCRIPTION =
	"Bind this checkout's repository to a Promptomat workspace, so future tool calls resolve to it. Call it after resolve-repository reports the checkout as unresolved or ambiguous, passing the workspaceId to bind to. Detects the project's technologies from package.json and records them on the workspace.";

const INPUT_SCHEMA = {
	workspaceId: z
		.number()
		.int()
		.positive()
		.describe("The id of the workspace to bind this repository to."),
};

const createBindRepositoryTool = (
	repositoryBindingApi: RepositoryBindingApi,
): Tool => ({
	description: DESCRIPTION,
	execute: async (arguments_) => {
		const { workspaceId } = arguments_ as z.infer<
			z.ZodObject<typeof INPUT_SCHEMA>
		>;

		const projectDirectory = process.cwd();
		const remoteUrl = await getRepositoryRemoteUrl(projectDirectory);

		if (!remoteUrl) {
			return createTextResult(
				"This directory has no git remote named 'origin', so it cannot be identified as a repository. Binding is not possible without one.",
			);
		}

		const packageJsonContent = await readPackageJson(projectDirectory);
		const stackTags = packageJsonContent
			? detectStackTagsFromPackageJson(packageJsonContent)
			: [];

		await repositoryBindingApi.create({ remoteUrl, stackTags, workspaceId });

		return createTextResult(
			`Bound this repository to workspace id ${String(workspaceId)}.`,
		);
	},
	inputSchema: INPUT_SCHEMA,
	name: ToolName.BIND_REPOSITORY,
});

export { createBindRepositoryTool };
