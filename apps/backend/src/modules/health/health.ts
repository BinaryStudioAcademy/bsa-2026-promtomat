import { logger } from "~/libs/modules/logger/logger.js";

import { HealthController } from "./health.controller.js";

const healthController = new HealthController(logger);

export { healthController };
