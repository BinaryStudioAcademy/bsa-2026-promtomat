import { getErrorDetails } from "~/libs/helpers/helpers.js";
import { database } from "~/libs/modules/database/database.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { backFillPromptLabelsJob } from "~/modules/prompts/prompts.js";

try {
	database.connect();
	await backFillPromptLabelsJob.run();
	logger.info("Prompt labels backfill finished.");
} catch (error) {
	logger.error(
		"Prompt labels backfill stopped on an error.",
		getErrorDetails(error),
	);
} finally {
	await database.disconnect();
}
