import { hashing } from "~/libs/modules/hashing/hashing.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { token } from "~/libs/modules/token/token.js";
import { userService } from "~/modules/users/users.js";
import { workspaceService } from "~/modules/workspaces/workspaces.js";

import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";

const authService = new AuthService({
	hashing,
	tokenService: token,
	userService,
	workspaceService,
});
const authController = new AuthController(logger, authService);

export { authController };
