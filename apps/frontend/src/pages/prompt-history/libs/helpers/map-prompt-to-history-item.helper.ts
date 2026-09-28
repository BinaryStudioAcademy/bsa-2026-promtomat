import { type PromptItemResponseDto } from "~/modules/prompts/libs/types/types.js";

import { type PromptHistoryItem } from "../types/types.js";

const mapPromptToHistoryItem = (
	prompt: PromptItemResponseDto,
): PromptHistoryItem => ({
	...prompt,
	isComposed: false,
	uniqueKey: `training-${String(prompt.id)}`,
});

export { mapPromptToHistoryItem };
