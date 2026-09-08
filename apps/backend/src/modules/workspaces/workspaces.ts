import { logger } from "~/libs/modules/logger/logger.js";

import { membershipService } from "../memberships/memberships.js";
import { WorkspaceController } from "./workspace.controller.js";
import { WorkspaceModel } from "./workspace.model.js";
import { WorkspaceRepository } from "./workspace.repository.js";
import { WorkspaceService } from "./workspace.service.js";

const workspaceRepository = new WorkspaceRepository(WorkspaceModel);
const workspaceService = new WorkspaceService(
	membershipService,
	workspaceRepository,
);
const workspaceController = new WorkspaceController(
	logger,
	membershipService,
	workspaceService,
);

export { workspaceController, workspaceService };
