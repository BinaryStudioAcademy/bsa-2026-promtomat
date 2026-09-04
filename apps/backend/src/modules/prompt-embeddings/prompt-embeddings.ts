import { config } from "~/libs/modules/config/config.js";
import { embedding } from "~/libs/modules/embedding/embedding.js";
import { logger } from "~/libs/modules/logger/logger.js";

import { PromptEmbeddingModel } from "./prompt-embedding.model.js";
import { PromptEmbeddingRepository } from "./prompt-embedding.repository.js";
import { PromptEmbeddingService } from "./prompt-embedding.service.js";

const promptEmbeddingRepository = new PromptEmbeddingRepository(
	PromptEmbeddingModel,
);
const promptEmbeddingService = new PromptEmbeddingService({
	dimensions: config.ENV.EMBEDDING.DIMENSIONS,
	embeddingService: embedding,
	logger,
	modelId: config.ENV.EMBEDDING.MODEL_ID,
	promptEmbeddingRepository,
});

export { promptEmbeddingService };
export {
	type NearestPrompt,
	type PromptEmbeddingSource,
} from "./libs/types/types.js";
