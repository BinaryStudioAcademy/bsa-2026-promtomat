import { hashing } from "~/libs/modules/hashing/hashing.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { workspaceService } from "~/modules/workspaces/workspaces.js";

import { UserController } from "./user.controller.js";
import { UserModel } from "./user.model.js";
import { UserRepository } from "./user.repository.js";
import { UserService } from "./user.service.js";

const userRepository = new UserRepository(UserModel);
const userService = new UserService(hashing, userRepository, workspaceService);
const userController = new UserController(logger, userService);

export { userController, userService };
