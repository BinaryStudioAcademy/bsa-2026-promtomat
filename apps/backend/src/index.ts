import { embedding } from "~/libs/modules/embedding/embedding.js";
import { serverApplication } from "~/libs/modules/server-application/server-application.js";
import { promptEmbeddingService } from "~/modules/prompt-embeddings/prompt-embeddings.js";

embedding.init();
promptEmbeddingService.scheduleBackfill();

await serverApplication.init();
