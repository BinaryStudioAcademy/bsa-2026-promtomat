import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { s3 } from "~/libs/modules/s3/s3.js";

import { LocalEmbeddingService } from "./local-embedding.module.js";
import { S3ModelStore } from "./s3-model-store.module.js";

const embedding = new LocalEmbeddingService({
	dimensions: config.ENV.EMBEDDING.DIMENSIONS,
	localPath: config.ENV.EMBEDDING.LOCAL_PATH,
	logger,
	modelId: config.ENV.EMBEDDING.MODEL_ID,
	store: new S3ModelStore({
		bucket: config.ENV.EMBEDDING.S3_BUCKET,
		logger,
		prefix: config.ENV.EMBEDDING.S3_PREFIX,
		s3,
	}),
});

export { embedding };
export { EmbeddingStatus } from "./libs/enums/enums.js";
export {
	EmbeddingFailedError,
	EmbeddingNotReadyError,
} from "./libs/exceptions/exceptions.js";
export { type Embedding, type EmbeddingService } from "./libs/types/types.js";
