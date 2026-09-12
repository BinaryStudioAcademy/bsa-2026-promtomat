import { TOKENS_THRESHOLD } from "../constants/tokens-threshold.constant.js";

const TextGenerationErrorMessage = {
	TOKENS_THRESHOLD_EXCEEDED: `Token threshold exceeded, maximum allowed value: ${String(TOKENS_THRESHOLD)}`,
	UNABLE_TO_GENERATE_STRUCTURE: "Could not generate structured output.",
	UNABLE_TO_GENERATE_TEXT: "Could not generate text.",
} as const;

export { TextGenerationErrorMessage };
