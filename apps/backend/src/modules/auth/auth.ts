import { database } from "~/libs/modules/database/database.js";
import { hashing } from "~/libs/modules/hashing/hashing.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { token } from "~/libs/modules/token/token.js";
import { userService } from "~/modules/users/users.js";

import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";

const authService = new AuthService({
	database,
	hashing,
	tokenService: token,
	userService,
});
const authController = new AuthController(logger, authService);

export { authController };
