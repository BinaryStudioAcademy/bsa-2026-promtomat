import { type preHandlerAsyncHookHandler } from "fastify";

import {
	AuthError,
	ComposedPromptError,
	PromptError,
} from "~/libs/exceptions/exceptions.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type ComposedPromptService } from "~/modules/composed-prompts/composed-prompt.service.js";
import { type PromptService } from "~/modules/prompts/prompt.service.js";
import { type WorkspaceService } from "~/modules/workspaces/workspace.service.js";

import { EvaluationTargetType } from "../enums/enums.js";
import { type EvaluationCreateRequestDto } from "../types/types.js";

type Parameters = {
	composedPromptService: ComposedPromptService;
	promptService: PromptService;
	workspaceService: WorkspaceService;
};

type TargetAccessHandler = {
	findWorkspaceId: (targetId: number) => Promise<null | number>;
	notFoundError: () => Error;
};

const evaluationAccessHook = ({
	composedPromptService,
	promptService,
	workspaceService,
}: Parameters): preHandlerAsyncHookHandler => {
	const targetHandlers: Record<
		ValueOf<typeof EvaluationTargetType>,
		TargetAccessHandler
	> = {
		[EvaluationTargetType.COMPOSED_PROMPT]: {
			findWorkspaceId: (targetId) =>
				composedPromptService.findWorkspaceId(targetId),
			notFoundError: () => ComposedPromptError.notFound(),
		},
		[EvaluationTargetType.PROMPT]: {
			findWorkspaceId: (targetId) => promptService.findWorkspaceId(targetId),
			notFoundError: () => PromptError.notFound(),
		},
	};

	return async (request) => {
		if (!request.user) {
			throw AuthError.unauthorized();
		}

		const { targetId, targetType } = request.body as EvaluationCreateRequestDto;
		const handler = targetHandlers[targetType];
		const workspaceId = await handler.findWorkspaceId(targetId);

		if (!workspaceId) {
			throw handler.notFoundError();
		}

		const [ownerWorkspace, contributorWorkspace] = await Promise.all([
			workspaceService.findByIdAndOwner(workspaceId, request.user.id),
			workspaceService.findByIdAndContributor(workspaceId, request.user.id),
		]);

		if (!ownerWorkspace && !contributorWorkspace) {
			throw handler.notFoundError();
		}
	};
};

export { evaluationAccessHook };
