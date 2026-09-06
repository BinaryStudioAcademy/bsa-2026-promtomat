import { logger } from "~/libs/modules/logger/logger.js";

import { WorkspaceController } from "./workspace.controller.js";
import { WorkspaceModel } from "./workspace.model.js";
import { WorkspaceRepository } from "./workspace.repository.js";
import { WorkspaceService } from "./workspace.service.js";

const workspaceRepository = new WorkspaceRepository(WorkspaceModel);
const workspaceService = new WorkspaceService(workspaceRepository);
const workspaceController = new WorkspaceController(logger, workspaceService);

export { workspaceController, workspaceService };
