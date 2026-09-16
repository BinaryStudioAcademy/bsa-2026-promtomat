import { type LabelStructuredGenerationOutput } from "../types/types.js";

const checkIsLabelOutput = (
	value: unknown,
): value is LabelStructuredGenerationOutput =>
	typeof value === "object" &&
	value !== null &&
	"label" in value &&
	typeof value.label === "string";

export { checkIsLabelOutput };
