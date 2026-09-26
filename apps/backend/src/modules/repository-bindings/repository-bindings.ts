import { logger } from "~/libs/modules/logger/logger.js";
import { workspaceService } from "~/modules/workspaces/workspaces.js";

import { RepositoryBindingController } from "./repository-binding.controller.js";
import { RepositoryBindingModel } from "./repository-binding.model.js";
import { RepositoryBindingRepository } from "./repository-binding.repository.js";
import { RepositoryBindingService } from "./repository-binding.service.js";

const repositoryBindingRepository = new RepositoryBindingRepository(
	RepositoryBindingModel,
);

const repositoryBindingService = new RepositoryBindingService(
	repositoryBindingRepository,
	workspaceService,
);
const repositoryBindingController = new RepositoryBindingController(
	logger,
	repositoryBindingService,
	workspaceService,
);

export { repositoryBindingController };
