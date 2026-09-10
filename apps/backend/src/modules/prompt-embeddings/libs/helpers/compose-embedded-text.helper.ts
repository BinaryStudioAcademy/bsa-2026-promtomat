import { EMBEDDED_TEXT_SEPARATOR } from "../constants/constants.js";
import { type PromptEmbeddingSource } from "../types/types.js";

const composeEmbeddedText = ({
	promptBody,
	taskIntent,
}: PromptEmbeddingSource): string =>
	`${taskIntent}${EMBEDDED_TEXT_SEPARATOR}${promptBody}`;

export { composeEmbeddedText };
