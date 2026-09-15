import { config } from "~/libs/modules/config/config.js";

import { Bedrock } from "./bedrock.module.js";

const bedrock = new Bedrock({
	connectionTimeoutMs: config.ENV.BEDROCK.CONNECTION_TIMEOUT_MS,
	maxAttempts: config.ENV.BEDROCK.MAX_ATTEMPTS,
	modelId: config.ENV.BEDROCK.MODEL.ID,
	region: config.ENV.AWS.REGION,
	requestTimeoutMs: config.ENV.BEDROCK.REQUEST_TIMEOUT_MS,
});

export { bedrock };
export { BedrockServiceError } from "./libs/exceptions/exceptions.js";
export {
	type BedrockInterface,
	type CommandOptions,
	type CommandOutput,
	type StructuredOutputSchema,
} from "./libs/types/types.js";
