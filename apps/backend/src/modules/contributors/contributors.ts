import { logger } from "~/libs/modules/logger/logger.js";
import { userService } from "~/modules/users/users.js";
import { workspaceService } from "~/modules/workspaces/workspaces.js";

import { ContributorController } from "./contributor.controller.js";
import { ContributorModel } from "./contributor.model.js";
import { ContributorRepository } from "./contributor.repository.js";
import { ContributorService } from "./contributor.service.js";

const contributorRepository = new ContributorRepository(ContributorModel);

const contributorService = new ContributorService(
	contributorRepository,
	userService,
);
const contributorController = new ContributorController(
	logger,
	contributorService,
	workspaceService,
);

export { contributorController };
