import { logger } from "~/libs/modules/logger/logger.js";

import { EnvironmentConfig } from "./environment-config.module.js";

const config = new EnvironmentConfig(logger);

export { config };
