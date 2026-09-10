import { config } from "~/libs/modules/config/config.js";
import { embedding } from "~/libs/modules/embedding/embedding.js";
import { generator } from "~/libs/modules/generator/generator.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { promptEmbeddingService } from "~/modules/prompt-embeddings/prompt-embeddings.js";
import { promptService } from "~/modules/prompts/prompts.js";
import { workspaceService } from "~/modules/workspaces/workspaces.js";

import { ComposedPromptModel } from "./composed-prompt.model.js";
import { ComposedPromptRepository } from "./composed-prompt.repository.js";
import { ComposedPromptService } from "./composed-prompt.service.js";
import { TemporaryPromptSearchService } from "./prompt-search.service.js";

const composedPromptRepository = new ComposedPromptRepository(
	ComposedPromptModel,
);
const promptSearchService = new TemporaryPromptSearchService({
	embeddingService: embedding,
	promptEmbeddingService,
	promptService,
});
const composedPromptService = new ComposedPromptService({
	candidateLimit: config.ENV.GENERATION.CANDIDATE_LIMIT,
	composedPromptRepository,
	generator,
	logger,
	maxTokens: config.ENV.GENERATION.MAX_TOKENS,
	modelId: config.ENV.BEDROCK.MODEL.ID,
	promptSearchService,
	workspaceService,
});

export { composedPromptService };
