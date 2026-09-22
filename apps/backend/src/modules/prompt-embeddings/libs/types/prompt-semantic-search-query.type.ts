import { type PromptQualityTier } from "~/libs/enums/enums.js";
import { type Embedding } from "~/libs/modules/embedding/embedding.js";
import { type ValueOf } from "~/libs/types/types.js";

type PromptSemanticSearchQuery = {
	embedding: Embedding;
	limit: number;
	offset: number;
	qualityTier?: undefined | ValueOf<typeof PromptQualityTier>;
	score?: number | undefined;
	userId: number;
	workspaceId?: number | undefined;
};

export { type PromptSemanticSearchQuery };
