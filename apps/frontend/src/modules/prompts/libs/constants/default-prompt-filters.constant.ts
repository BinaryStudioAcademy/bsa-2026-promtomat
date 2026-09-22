import { PromptQualityTier } from "../enums/enums.js";

const DEFAULT_PROMPT_FILTERS_VALUES = {
	qualityTier: PromptQualityTier.ALL,
	search: "",
	workspaceId: null,
} as const;

export { DEFAULT_PROMPT_FILTERS_VALUES };
