import { ToolName } from "~/libs/enums/enums.js";
import { createMCPTextResult } from "~/libs/helpers/helpers.js";
import { type Tool } from "~/libs/types/types.js";
import {
	type RepositoryBindingApi,
	resolveWorkspace,
	WorkspaceResolutionStatus,
} from "~/modules/repository-bindings/repository-bindings.js";

import { type ComposedPromptApi } from "./composed-prompt-api.js";
import { COMPOSE_PROMPT_DESCRIPTION } from "./libs/constants/constants.js";
import { ComposeRefusalMessage } from "./libs/enums/enums.js";
import { formatComposeResponse } from "./libs/helpers/helpers.js";
import { type ComposePromptArguments } from "./libs/types/types.js";
import { composePromptInputSchema } from "./libs/validation-schemas/validation-schemas.js";

const createComposeTool = (
	composedPromptApi: ComposedPromptApi,
	repositoryBindingApi: RepositoryBindingApi,
	webUrl: string,
): Tool => ({
	description: COMPOSE_PROMPT_DESCRIPTION,
	execute: async (arguments_) => {
		const { description, remoteName } = arguments_ as ComposePromptArguments;

		const resolution = await resolveWorkspace({
			projectDirectory: process.cwd(),
			remoteName,
			repositoryBindingApi,
		});

		switch (resolution.status) {
			case WorkspaceResolutionStatus.REMOTE_AMBIGUOUS:
			case WorkspaceResolutionStatus.REMOTE_NONE: {
				return createMCPTextResult(
					ComposeRefusalMessage.REPOSITORY_NOT_IDENTIFIED,
				);
			}

			case WorkspaceResolutionStatus.RESOLVED: {
				const response = await composedPromptApi.compose({
					description,
					workspaceId: resolution.workspaceId,
				});

				return createMCPTextResult(formatComposeResponse(response, webUrl));
			}

			case WorkspaceResolutionStatus.WORKSPACE_AMBIGUOUS: {
				return createMCPTextResult(ComposeRefusalMessage.WORKSPACE_AMBIGUOUS);
			}

			case WorkspaceResolutionStatus.WORKSPACE_UNRESOLVED: {
				return createMCPTextResult(ComposeRefusalMessage.WORKSPACE_NOT_BOUND);
			}
		}
	},
	inputSchema: composePromptInputSchema,
	name: ToolName.COMPOSE_PROMPT,
});

export { createComposeTool };
