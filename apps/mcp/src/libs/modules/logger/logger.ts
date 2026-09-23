import { PinoLogger } from "./pino-logger.module.js";

const logger = new PinoLogger();

export { logger };
export { type Logger } from "./libs/types/types.js";
