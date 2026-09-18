import { bedrock } from "~/libs/modules/bedrock/bedrock.js";

import { Generator } from "./generator.module.js";

const generator = new Generator({
	bedrockService: bedrock,
});

export { generator };
export { SchemaKey, TextGenerationErrorCode } from "./libs/enums/enums.js";
export { TextGenerationError } from "./libs/exceptions/exceptions.js";
export { type GeneratorInterface } from "./libs/types/types.js";
