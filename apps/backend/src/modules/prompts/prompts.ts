import { logger } from "~/libs/modules/logger/logger.js";
import { promptEmbeddingService } from "~/modules/prompt-embeddings/prompt-embeddings.js";

import { workspaceService } from "../workspaces/workspaces.js";
import { PromptController } from "./prompt.controller.js";
import { PromptModel } from "./prompt.model.js";
import { PromptRepository } from "./prompt.repository.js";
import { PromptService } from "./prompt.service.js";

const promptRepository = new PromptRepository(PromptModel);
const promptService = new PromptService(
	promptRepository,
	workspaceService,
	promptEmbeddingService,
);
const promptController = new PromptController(logger, promptService);

export { promptController };
