import { type PromptItemResponseDto } from "~/modules/prompts/libs/types/types.js";

type PromptHistoryItem = PromptItemResponseDto & {
	isComposed?: boolean;
	uniqueKey: string;
};

export { type PromptHistoryItem };
