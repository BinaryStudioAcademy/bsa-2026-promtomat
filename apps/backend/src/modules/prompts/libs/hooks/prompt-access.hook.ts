import { type preHandlerAsyncHookHandler } from "fastify";

import { AuthError, PromptError } from "~/libs/exceptions/exceptions.js";

import { type PromptService } from "../../prompt.service.js";

const promptAccessHook = (
	promptService: PromptService,
): preHandlerAsyncHookHandler => {
	return async (request) => {
		if (!request.user) {
			throw AuthError.unauthorized();
		}

		const promptId = (request.params as { promptId: number }).promptId;

		const prompt = await promptService.findByIdAndOwner(
			promptId,
			request.user.id,
		);

		if (!prompt) {
			throw PromptError.notFound();
		}
	};
};

export { promptAccessHook };
