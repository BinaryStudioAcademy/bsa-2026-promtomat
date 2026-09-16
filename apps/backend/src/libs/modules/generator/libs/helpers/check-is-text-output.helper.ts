import { type TextStructuredGenerationOutput } from "../types/types.js";

const checkIsTextOutput = (
	value: unknown,
): value is TextStructuredGenerationOutput =>
	typeof value === "object" &&
	value !== null &&
	"text" in value &&
	typeof value.text === "string";

export { checkIsTextOutput };
