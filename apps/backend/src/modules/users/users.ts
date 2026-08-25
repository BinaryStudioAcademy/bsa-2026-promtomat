import { logger } from "~/libs/modules/logger/logger.js";
import { passwordHasher } from "~/libs/modules/password-hasher/password-hasher.js";

import { UserController } from "./user.controller.js";
import { UserModel } from "./user.model.js";
import { UserRepository } from "./user.repository.js";
import { UserService } from "./user.service.js";

const userRepository = new UserRepository(UserModel);
const userService = new UserService(passwordHasher, userRepository);
const userController = new UserController(logger, userService);

export { userController, userService };
