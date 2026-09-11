import { config } from "~/libs/modules/config/config.js";
import { hashing } from "~/libs/modules/hashing/hashing.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { mail } from "~/libs/modules/mail/mail.js";
import { token } from "~/libs/modules/token/token.js";
import { userService } from "~/modules/users/users.js";

import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";

const authService = new AuthService({
	hashing,
	linkBaseUrl: config.ENV.PASSWORD_RESET.LINK_BASE_URL,
	logger,
	mailService: mail,
	tokenService: token,
	tokenTtlMinutes: config.ENV.PASSWORD_RESET.TOKEN_TTL_MINUTES,
	userService,
});
const authController = new AuthController(logger, authService);

export { authController };
