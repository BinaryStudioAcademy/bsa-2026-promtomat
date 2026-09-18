import { EMBEDDED_TEXT_SEPARATOR } from "../constants/constants.js";
import { type PromptEmbeddingSource } from "../types/types.js";

const composeEmbeddedText = ({
	promptBody,
	taskIntent,
}: Pick<PromptEmbeddingSource, "promptBody" | "taskIntent">): string =>
	`${taskIntent}${EMBEDDED_TEXT_SEPARATOR}${promptBody}`;

export { composeEmbeddedText };
