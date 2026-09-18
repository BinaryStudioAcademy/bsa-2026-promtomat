import { destination, type Logger as LibraryLogger, pino } from "pino";

import { type Logger } from "./libs/types/types.js";

const LOG_LEVEL = "info";

const REDACTED_PATHS = ["authorization", "token", "*.authorization", "*.token"];

// Standard output carries the protocol, so every diagnostic line goes to standard error.
// The destination is synchronous so a line written right before the process exits is not lost.
const STDERR_FILE_DESCRIPTOR = 2;

class PinoLogger implements Logger {
	private logger: LibraryLogger;

	public constructor() {
		this.logger = pino(
			{ level: LOG_LEVEL, redact: REDACTED_PATHS },
			destination({ fd: STDERR_FILE_DESCRIPTOR, sync: true }),
		);
	}

	public debug(
		message: string,
		parameters: Record<string, unknown> = {},
	): ReturnType<Logger["debug"]> {
		this.logger.debug(parameters, message);
	}

	public error(
		message: string,
		parameters: Record<string, unknown> = {},
	): ReturnType<Logger["error"]> {
		this.logger.error(parameters, message);
	}

	public flush(): ReturnType<Logger["flush"]> {
		this.logger.flush();
	}

	public info(
		message: string,
		parameters: Record<string, unknown> = {},
	): ReturnType<Logger["info"]> {
		this.logger.info(parameters, message);
	}

	public warn(
		message: string,
		parameters: Record<string, unknown> = {},
	): ReturnType<Logger["warn"]> {
		this.logger.warn(parameters, message);
	}
}

export { PinoLogger };
