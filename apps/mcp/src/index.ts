#!/usr/bin/env node
import { ExitCode } from "~/libs/enums/enums.js";
import { getErrorMessage } from "~/libs/helpers/helpers.js";
import { logger } from "~/libs/modules/logger/logger.js";

const SHUTDOWN_SIGNALS = ["SIGINT", "SIGTERM"] as const;

const exitWithFailure = (error: unknown): never => {
	logger.error(getErrorMessage(error));
	process.exit(ExitCode.FAILURE);
};

try {
	const { server } = await import("~/libs/modules/server/server.js");

	const stop = async (): Promise<void> => {
		try {
			await server.stop();
		} catch (error) {
			exitWithFailure(error);
		}
	};

	for (const signal of SHUTDOWN_SIGNALS) {
		process.on(signal, () => void stop());
	}

	await server.start();
} catch (error) {
	exitWithFailure(error);
}
