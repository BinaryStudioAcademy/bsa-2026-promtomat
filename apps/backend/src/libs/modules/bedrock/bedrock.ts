import { config } from "~/libs/modules/config/config.js";

import { Bedrock } from "./bedrock.module.js";

const bedrock = new Bedrock({
	modelId: config.ENV.BEDROCK.MODEL.ID,
	region: config.ENV.AWS.REGION,
	requestTimeoutMs: config.ENV.BEDROCK.REQUEST_TIMEOUT_MS,
});

export { bedrock };
export { TextGenerationError } from "./libs/exceptions/text-generation-error.exception.js";
export { checkIsTimeoutError } from "./libs/helpers/helpers.js";
export {
	type BedrockInterface,
	type CommandOptions,
	type StructuredOutputSchema,
} from "./libs/types/types.js";
