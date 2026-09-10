import { getErrorDetails } from "~/libs/helpers/helpers.js";
import { database } from "~/libs/modules/database/database.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { backFillCronJob } from "~/modules/prompts/prompts.js";

try {
	database.connect();
	await backFillCronJob.run();
	logger.info("Lables backfill for prompts finished");
} catch (error) {
	logger.error("Labels backfill for promts failed", getErrorDetails(error));
} finally {
	await database.disconnect();
}
