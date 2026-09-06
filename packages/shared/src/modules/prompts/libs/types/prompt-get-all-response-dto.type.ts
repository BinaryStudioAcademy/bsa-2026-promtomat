import { type PromptItemResponseDto } from "./prompt-item-response-dto.type.js";

type PromptGetAllResponseDto = {
	averageScore: number;
	items: PromptItemResponseDto[];
	totalCount: number;
};

export { type PromptGetAllResponseDto };
