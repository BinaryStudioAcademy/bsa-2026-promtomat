import { setTimeout as delay } from "node:timers/promises";

import { getErrorDetails } from "~/libs/helpers/helpers.js";
import { database } from "~/libs/modules/database/database.js";
import {
	embedding,
	EmbeddingStatus,
} from "~/libs/modules/embedding/embedding.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { promptEmbeddingService } from "~/modules/prompt-embeddings/prompt-embeddings.js";

import {
	BACKFILL_FAILURE_EXIT_CODE,
	EMBEDDING_READY_TIMEOUT_MS,
	EMBEDDING_STATUS_POLL_INTERVAL_MS,
	NO_FAILED_ROWS,
} from "./libs/constants/constants.js";

const waitForEmbeddingModel = async (): Promise<void> => {
	const deadline = Date.now() + EMBEDDING_READY_TIMEOUT_MS;

	while (
		embedding.status === EmbeddingStatus.LOADING &&
		Date.now() < deadline
	) {
		await delay(EMBEDDING_STATUS_POLL_INTERVAL_MS);
	}
};

const runBackfill = async (): Promise<void> => {
	const { embedded, failed, skipped } = await promptEmbeddingService.backfill();

	logger.info("Prompt embeddings backfill finished.", {
		embedded,
		failed,
		skipped,
	});

	if (failed > NO_FAILED_ROWS) {
		process.exitCode = BACKFILL_FAILURE_EXIT_CODE;
	}
};

embedding.init();
await waitForEmbeddingModel();

if (embedding.status === EmbeddingStatus.LOADING) {
	logger.error(
		`Prompt embeddings backfill did not start — the embedding model is still loading after ${EMBEDDING_READY_TIMEOUT_MS.toString()} ms; nothing was changed, rerun once it is ready.`,
	);
	logger.flush();

	// eslint-disable-next-line unicorn/no-process-exit -- the download still in flight would keep the script alive
	process.exit(BACKFILL_FAILURE_EXIT_CODE);
}

if (embedding.status === EmbeddingStatus.FAILED) {
	logger.error(
		"Prompt embeddings backfill did not start — the embedding model failed to provision; nothing was changed, rerun once the model loads.",
	);
	process.exitCode = BACKFILL_FAILURE_EXIT_CODE;
} else {
	database.connect();

	try {
		await runBackfill();
	} catch (error) {
		logger.error(
			"Prompt embeddings backfill stopped on an error.",
			getErrorDetails(error),
		);
		process.exitCode = BACKFILL_FAILURE_EXIT_CODE;
	} finally {
		await database.disconnect();
	}
}
