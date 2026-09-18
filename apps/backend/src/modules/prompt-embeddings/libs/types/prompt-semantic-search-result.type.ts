import { type PromptRepositoryItem } from "~/modules/prompts/libs/types/types.js";

type PromptSemanticSearchResult = {
	averageScore: null | number;
	items: PromptRepositoryItem[];
	totalCount: number;
};

export { type PromptSemanticSearchResult };
