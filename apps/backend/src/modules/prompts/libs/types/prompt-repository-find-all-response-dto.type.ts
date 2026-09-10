import { type PromptModel } from "../../prompt.model.js";

type PromptRepositoryFindAllResponseDto = {
	averageScore: null | number;
	items: PromptModel[];
	page: number;
	pageSize: number;
	totalCount: number;
};

export { type PromptRepositoryFindAllResponseDto };
