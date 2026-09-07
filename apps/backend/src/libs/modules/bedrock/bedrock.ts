import { Bedrock } from "./bedrock.module.js";

const bedrock = new Bedrock();

export { bedrock };
export { TextGenerationError } from "./libs/exceptions/text-generation-error.exception.js";
export {
	type BedrockInterface,
	type StructuredGenerationOptions,
	type TextGenerationOptions,
} from "./libs/types/types.js";
