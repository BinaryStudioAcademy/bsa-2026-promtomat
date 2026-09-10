import { config } from "~/libs/modules/config/config.js";
import { database } from "~/libs/modules/database/database.js";
import { hashing } from "~/libs/modules/hashing/hashing.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { mail } from "~/libs/modules/mail/mail.js";
import { passwordResetRateLimit } from "~/libs/modules/rate-limit/rate-limit.js";
import { token } from "~/libs/modules/token/token.js";
import { userService } from "~/modules/users/users.js";

import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { PasswordResetModel } from "./password-reset.model.js";
import { PasswordResetRepository } from "./password-reset.repository.js";

const passwordResetRepository = new PasswordResetRepository(PasswordResetModel);

const authService = new AuthService({
	database,
	hashing,
	linkBaseUrl: config.ENV.PASSWORD_RESET.LINK_BASE_URL,
	logger,
	mailService: mail,
	passwordResetRepository,
	rateLimitService: passwordResetRateLimit,
	tokenService: token,
	tokenTtlMinutes: config.ENV.PASSWORD_RESET.TOKEN_TTL_MINUTES,
	userService,
});
const authController = new AuthController(logger, authService);

export { authController };
