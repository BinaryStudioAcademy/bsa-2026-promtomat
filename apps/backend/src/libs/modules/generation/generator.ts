import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

import { config } from "~/libs/modules/config/config.js";

import { Generator } from "./generator.module.js";
import { BedrockService } from "./libs/services/services.js";

const bedrockService = new BedrockService({
	client: new BedrockRuntimeClient({
		region: config.ENV.BEDROCK.REGION,
	}),
	modelId: config.ENV.BEDROCK.MODEL.ID,
});

const generator = new Generator({
	client: bedrockService,
});

export { generator };
export { type GeneratorInterface } from "./libs/types/types.js";
