import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";

import { LocalEmbeddingService } from "./local-embedding.service.js";

const embedding = new LocalEmbeddingService({
	dimensions: config.ENV.EMBEDDING.DIMENSIONS,
	localPath: config.ENV.EMBEDDING.LOCAL_PATH,
	logger,
	modelId: config.ENV.EMBEDDING.MODEL_ID,
});

export { embedding };
export { EmbeddingStatus } from "./libs/enums/enums.js";
export {
	EmbeddingFailedError,
	EmbeddingNotReadyError,
} from "./libs/exceptions/exceptions.js";
export { type Embedding, type EmbeddingService } from "./libs/types/types.js";
