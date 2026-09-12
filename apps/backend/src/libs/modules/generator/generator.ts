import { bedrock } from "~/libs/modules/bedrock/bedrock.js";

import { Generator } from "./generator.module.js";

const generator = new Generator({
	bedrockService: bedrock,
});

export { generator };
export { SchemaKey } from "./libs/enums/enums.js";
export {
	type ComposedPromptStructuredGenerationOutput,
	type GeneratorInterface,
} from "./libs/types/types.js";
