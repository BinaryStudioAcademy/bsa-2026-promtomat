import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

import { config } from "~/libs/modules/config/config.js";

import { Bedrock } from "./bedrock.module.js";

const bedrock = new Bedrock({
	client: new BedrockRuntimeClient({
		region: config.ENV.AWS.REGION,
	}),
	modelId: config.ENV.BEDROCK.MODEL.ID,
});

export { bedrock };
export { TextGenerationError } from "./libs/exceptions/text-generation-error.exception.js";
export {
	type BedrockInterface,
	type StructuredGenerationOptions,
	type TextGenerationOptions,
} from "./libs/types/types.js";
