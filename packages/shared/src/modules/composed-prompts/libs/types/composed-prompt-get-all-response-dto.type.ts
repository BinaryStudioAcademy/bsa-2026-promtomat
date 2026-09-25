import { type ComposedPromptDto } from "./composed-prompt-dto.type.js";

type ComposedPromptGetAllResponseDto = {
	items: ComposedPromptDto[];
	page: number;
	pageSize: number;
	totalCount: number;
};

export { type ComposedPromptGetAllResponseDto };
