import { config } from "~/libs/modules/config/config.js";
import { generator } from "~/libs/modules/generator/generator.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { promptService } from "~/modules/prompts/prompts.js";
import { workspaceService } from "~/modules/workspaces/workspaces.js";

import { ComposedPromptController } from "./composed-prompt.controller.js";
import { ComposedPromptModel } from "./composed-prompt.model.js";
import { ComposedPromptRepository } from "./composed-prompt.repository.js";
import { ComposedPromptService } from "./composed-prompt.service.js";

const composedPromptRepository = new ComposedPromptRepository(
	ComposedPromptModel,
);
const composedPromptService = new ComposedPromptService({
	candidateLimit: config.ENV.GENERATION.CANDIDATE_LIMIT,
	composedPromptRepository,
	generator,
	logger,
	maxTokens: config.ENV.GENERATION.MAX_TOKENS,
	modelId: config.ENV.BEDROCK.MODEL.ID,
	promptSearchService: promptService,
	workspaceService,
});

const composedPromptController = new ComposedPromptController(
	logger,
	composedPromptService,
	workspaceService,
);

export { composedPromptController };
