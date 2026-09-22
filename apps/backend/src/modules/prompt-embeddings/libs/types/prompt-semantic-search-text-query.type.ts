import { type PromptQualityTier } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

type PromptSemanticSearchTextQuery = {
	limit: number;
	offset: number;
	qualityTier?: undefined | ValueOf<typeof PromptQualityTier>;
	score?: number | undefined;
	search: string;
	userId: number;
	workspaceId?: number | undefined;
};

export { type PromptSemanticSearchTextQuery };
