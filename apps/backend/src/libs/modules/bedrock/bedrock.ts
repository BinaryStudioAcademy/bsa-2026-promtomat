import { config } from "~/libs/modules/config/config.js";

import { Bedrock } from "./bedrock.module.js";

const bedrock = new Bedrock({
	modelId: config.ENV.BEDROCK.MODEL.ID,
	region: config.ENV.AWS.REGION,
});

export { bedrock };
export { BedrockServiceError } from "./libs/exceptions/exceptions.js";
export {
	type BedrockInterface,
	type CommandOptions,
	type CommandOutput,
	type StructuredOutputSchema,
} from "./libs/types/types.js";
