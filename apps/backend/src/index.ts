import { embedding } from "~/libs/modules/embedding/embedding.js";
import { serverApplication } from "~/libs/modules/server-application/server-application.js";
import { promptEmbeddingService } from "~/modules/prompt-embeddings/prompt-embeddings.js";

import { scheduler } from "./libs/modules/scheduler/scheduler.js";
import { backFillCronJob } from "./modules/prompts/prompts.js";

embedding.init();
promptEmbeddingService.scheduleBackfill();
scheduler.scheduleJob(backFillCronJob);

await serverApplication.init();
