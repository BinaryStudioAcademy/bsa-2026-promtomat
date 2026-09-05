import { logger } from "~/libs/modules/logger/logger.js";
import { PromptModel } from "~/modules/prompts/prompt.model.js";
import { PromptRepository } from "~/modules/prompts/prompt.repository.js";

import { WorkspaceController } from "./workspace.controller.js";
import { WorkspaceModel } from "./workspace.model.js";
import { WorkspaceRepository } from "./workspace.repository.js";
import { WorkspaceService } from "./workspace.service.js";

const promptRepository = new PromptRepository(PromptModel);
const workspaceRepository = new WorkspaceRepository(WorkspaceModel);
const workspaceService = new WorkspaceService(
	workspaceRepository,
	promptRepository,
);
const workspaceController = new WorkspaceController(logger, workspaceService);

export { workspaceController, workspaceService };
