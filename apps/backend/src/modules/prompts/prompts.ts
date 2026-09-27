import { database } from "~/libs/modules/database/database.js";
import { generator } from "~/libs/modules/generator/generator.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { scheduler } from "~/libs/modules/scheduler/scheduler.js";
import { promptEmbeddingService } from "~/modules/prompt-embeddings/prompt-embeddings.js";

import { labelService } from "../labels/labels.js";
import { UserStreakService } from "../users/user-streak.service.js";
import { UserModel } from "../users/user.model.js";
import { UserRepository } from "../users/user.repository.js";
import { workspaceService } from "../workspaces/workspaces.js";
import { BackFillPromptLabelsJob } from "./libs/cron-jobs/cron-jobs.js";
import { PromptController } from "./prompt.controller.js";
import { PromptModel } from "./prompt.model.js";
import { PromptRepository } from "./prompt.repository.js";
import { PromptService } from "./prompt.service.js";

const promptRepository = new PromptRepository(PromptModel);
const userRepository = new UserRepository(UserModel);
const userStreakService = new UserStreakService({ userRepository });
const promptService = new PromptService({
	database,
	generator,
	labelService,
	promptEmbeddingService,
	promptRepository,
	userStreakService,
	workspaceService,
});

const backFillPromptLabelsJob = new BackFillPromptLabelsJob({
	logger,
	promptService,
	scheduler,
});

const promptController = new PromptController(
	logger,
	promptService,
	workspaceService,
);

export { backFillPromptLabelsJob, promptController, promptService };
