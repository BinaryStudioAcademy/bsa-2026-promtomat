import { PromptHistoryScoreTier } from "~/modules/prompt-history/libs/enums/enums.js";

const DEFAULT_PROMPT_FILTERS = {
	qualityTier: PromptHistoryScoreTier.ALL,
	search: "",
	workspaceId: null,
} as const;

export { DEFAULT_PROMPT_FILTERS };
