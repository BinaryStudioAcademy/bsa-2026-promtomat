import { logger } from "~/libs/modules/logger/logger.js";
import { workspaceService } from "~/modules/workspaces/workspaces.js";

import { PromptModel } from "../prompts/prompt.model.js";
import { AnalyticsController } from "./analytics.controller.js";
import { AnalyticsRepository } from "./analytics.repository.js";
import { AnalyticsService } from "./analytics.service.js";

const analyticsRepository = new AnalyticsRepository(PromptModel);
const analyticsService = new AnalyticsService(analyticsRepository);

const analyticsController = new AnalyticsController(
	logger,
	analyticsService,
	workspaceService,
);

export { analyticsController };
