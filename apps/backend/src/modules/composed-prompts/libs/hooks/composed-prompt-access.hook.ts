import { type preHandlerAsyncHookHandler } from "fastify";

import {
	AuthError,
	ComposedPromptError,
} from "~/libs/exceptions/exceptions.js";
import { type WorkspaceService } from "~/modules/workspaces/workspace.service.js";

import { type ComposedPromptService } from "../../composed-prompt.service.js";
import { type ComposedPromptIdParametersDto } from "../types/types.js";

const composedPromptAccessHook = (
	composedPromptService: ComposedPromptService,
	workspaceService: WorkspaceService,
): preHandlerAsyncHookHandler => {
	return async (request) => {
		if (!request.user) {
			throw AuthError.unauthorized();
		}

		const { id } = request.params as ComposedPromptIdParametersDto;
		const workspaceId = await composedPromptService.findWorkspaceId(id);

		if (!workspaceId) {
			throw ComposedPromptError.notFound();
		}

		const workspace = await workspaceService.findByIdAndOwner(
			workspaceId,
			request.user.id,
		);

		if (!workspace) {
			throw ComposedPromptError.notFound();
		}
	};
};

export { composedPromptAccessHook };
