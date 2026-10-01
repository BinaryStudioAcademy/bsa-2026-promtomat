import { type PromptItemResponseDto } from "~/modules/prompts/libs/types/types.js";

type PromptHistoryFindAllResult = {
	averageScore: null | number;
	items: (PromptItemResponseDto & { isComposed: boolean })[];
	totalCount: number;
};

export { type PromptHistoryFindAllResult };
