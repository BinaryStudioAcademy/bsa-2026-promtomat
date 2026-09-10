import { logger } from "~/libs/modules/logger/logger.js";
import { workspaceService } from "~/modules/workspaces/workspaces.js";

import { LabelController } from "./label.controller.js";
import { LabelModel } from "./label.model.js";
import { LabelRepository } from "./label.repository.js";
import { LabelService } from "./label.service.js";

const labelRepository = new LabelRepository(LabelModel);
const labelService = new LabelService(labelRepository);

const labelController = new LabelController(
	logger,
	labelService,
	workspaceService,
);

export { labelController, labelService };

export { type LabelService } from "./label.service.js";
export {
	LABEL_MAX_LENGTH,
	LABEL_REUSE_SET_LIMIT,
} from "./libs/constants/constants.js";
export { normalizePromptLabel } from "./libs/helpers/helpers.js";
