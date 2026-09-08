import { type PagedResponseDto } from "../../../../libs/types/types.js";
import { type PromptItemResponseDto } from "./prompt-item-response-dto.type.js";

type PromptGetAllResponseDto = PagedResponseDto<PromptItemResponseDto> & {
	averageScore: null | number;
};

export { type PromptGetAllResponseDto };
