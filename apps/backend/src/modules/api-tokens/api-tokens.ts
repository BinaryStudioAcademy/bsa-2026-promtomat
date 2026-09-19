import { logger } from "~/libs/modules/logger/logger.js";

import { ApiTokenController } from "./api-token.controller.js";
import { ApiTokenModel } from "./api-token.model.js";
import { ApiTokenRepository } from "./api-token.repository.js";
import { ApiTokenService } from "./api-token.service.js";

const apiTokenRepository = new ApiTokenRepository(ApiTokenModel);
const apiTokenService = new ApiTokenService(apiTokenRepository, logger);
const apiTokenController = new ApiTokenController(logger, apiTokenService);

export { apiTokenController, apiTokenService };
export { type ApiTokenService } from "./api-token.service.js";
