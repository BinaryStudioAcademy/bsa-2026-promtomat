import { bedrock } from "~/libs/modules/bedrock/bedrock.js";

import { BedrockGenerator } from "./bedrock-generator.module.js";

const generator = new BedrockGenerator({
	bedrockService: bedrock,
});

export { generator };
export { SchemaKey } from "./libs/enums/enums.js";
export { type Generator } from "./libs/types/types.js";
