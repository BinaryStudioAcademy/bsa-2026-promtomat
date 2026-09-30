import { logger } from "~/libs/modules/logger/logger.js";
import { ComposedPromptModel } from "~/modules/composed-prompts/composed-prompt.model.js";
import { promptEmbeddingService } from "~/modules/prompt-embeddings/prompt-embeddings.js";
import { PromptModel } from "~/modules/prompts/prompt.model.js";
import { workspaceService } from "~/modules/workspaces/workspaces.js";

import { PromptHistoryController } from "./prompt-history.controller.js";
import { PromptHistoryRepository } from "./prompt-history.repository.js";
import { PromptHistoryService } from "./prompt-history.service.js";

const promptHistoryRepository = new PromptHistoryRepository(
	PromptModel,
	ComposedPromptModel,
);
const promptHistoryService = new PromptHistoryService(
	promptHistoryRepository,
	promptEmbeddingService,
	workspaceService,
);

const promptHistoryController = new PromptHistoryController(
	logger,
	promptHistoryService,
	workspaceService,
);

export { promptHistoryController };
