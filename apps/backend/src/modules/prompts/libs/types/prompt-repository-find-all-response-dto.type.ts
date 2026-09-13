import { type PromptRepositoryItem } from "./prompt-repository-item.type.js";

type PromptRepositoryFindAllResponseDto = {
	averageScore: null | number;
	items: PromptRepositoryItem[];
	page: number;
	pageSize: number;
	totalCount: number;
};

export { type PromptRepositoryFindAllResponseDto };
