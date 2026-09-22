import { type onRequestAsyncHookHandler } from "fastify";

import {
	AuthError,
	ComposedPromptError,
} from "~/libs/exceptions/exceptions.js";
import { type ComposedPromptService } from "~/modules/composed-prompts/composed-prompt.service.js";
import { type PromptService } from "~/modules/prompts/prompt.service.js";
import { type WorkspaceService } from "~/modules/workspaces/workspace.service.js";

import { type EvaluationCreateRequestDto } from "../types/types.js";

type Parameters = {
	composedPromptService: ComposedPromptService;
	promptService: PromptService;
	workspaceService: WorkspaceService;
};

const evaluationAccessHook = ({
	composedPromptService,
	promptService,
	workspaceService,
}: Parameters): onRequestAsyncHookHandler => {
	return async (request) => {
		if (!request.user) {
			throw AuthError.unauthorized();
		}

		const { composedPromptId, promptId } =
			request.body as EvaluationCreateRequestDto;

		if (promptId) {
			await promptService.findById(promptId, request.user.id);

			return;
		}

		const workspaceId = await composedPromptService.findWorkspaceId(
			composedPromptId as number,
		);

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

export { evaluationAccessHook };
