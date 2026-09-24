import { type onRequestAsyncHookHandler } from "fastify";

import {
	AuthError,
	ComposedPromptError,
	PromptError,
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

		const workspaceId = promptId
			? await promptService.findWorkspaceId(promptId)
			: await composedPromptService.findWorkspaceId(composedPromptId as number);

		if (!workspaceId) {
			throw promptId ? PromptError.notFound() : ComposedPromptError.notFound();
		}

		const [ownerWorkspace, contributorWorkspace] = await Promise.all([
			workspaceService.findByIdAndOwner(workspaceId, request.user.id),
			workspaceService.findByIdAndContributor(workspaceId, request.user.id),
		]);

		if (!ownerWorkspace && !contributorWorkspace) {
			throw promptId ? PromptError.notFound() : ComposedPromptError.notFound();
		}
	};
};

export { evaluationAccessHook };
