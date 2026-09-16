import { type ComposedPromptStructuredGenerationOutput } from "../types/types.js";

const checkIsNumberArray = (value: unknown): value is number[] =>
	Array.isArray(value) && value.every((entry) => typeof entry === "number");

const checkIsComposedPromptOutput = (
	value: unknown,
): value is ComposedPromptStructuredGenerationOutput =>
	typeof value === "object" &&
	value !== null &&
	"prompt" in value &&
	"explanation" in value &&
	"usedSources" in value &&
	typeof value.prompt === "string" &&
	typeof value.explanation === "string" &&
	checkIsNumberArray(value.usedSources);

export { checkIsComposedPromptOutput };
