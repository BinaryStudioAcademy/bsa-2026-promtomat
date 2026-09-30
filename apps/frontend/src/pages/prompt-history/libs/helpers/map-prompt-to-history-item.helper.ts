import { type PromptItemResponseDto } from "~/modules/prompts/libs/types/types.js";

import { type PromptHistoryItem } from "../types/types.js";

const mapPromptToHistoryItem = (
	prompt: PromptItemResponseDto & { isComposed?: boolean },
): PromptHistoryItem => ({
	...prompt,
	isComposed: Boolean(prompt.isComposed),
	uniqueKey: `${prompt.isComposed ? "composed" : "training"}-${String(prompt.id)}`,
});

export { mapPromptToHistoryItem };
