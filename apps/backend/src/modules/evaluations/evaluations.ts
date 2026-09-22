import { APIPath } from "~/libs/enums/enums.js";
import { database } from "~/libs/modules/database/database.js";
import { logger } from "~/libs/modules/logger/logger.js";
import {
	composedPromptRepository,
	composedPromptService,
} from "~/modules/composed-prompts/composed-prompts.js";
import { promptRepository, promptService } from "~/modules/prompts/prompts.js";
import { workspaceService } from "~/modules/workspaces/workspaces.js";

import { EvaluationController } from "./evaluation.controller.js";
import { EvaluationModel } from "./evaluation.model.js";
import { EvaluationRepository } from "./evaluation.repository.js";
import { EvaluationService } from "./evaluation.service.js";

const evaluationRepository = new EvaluationRepository(EvaluationModel);
const evaluationService = new EvaluationService({
	composedPromptRepository,
	database,
	evaluationRepository,
	promptRepository,
});
const evaluationController = new EvaluationController({
	apiPath: APIPath.EVALUATIONS,
	composedPromptService,
	evaluationService,
	logger,
	promptService,
	workspaceService,
});

export { evaluationController };
