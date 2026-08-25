import { logger } from "~/libs/modules/logger/logger.js";
import { passwordHasher } from "~/libs/modules/password-hasher/password-hasher.js";
import { userService } from "~/modules/users/users.js";

import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";

const authService = new AuthService(passwordHasher, userService);
const authController = new AuthController(logger, authService);

export { authController };
