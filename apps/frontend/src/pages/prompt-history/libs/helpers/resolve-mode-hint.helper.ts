import { PromptHistoryLabel } from "../enums/prompt-history-label.enum.js";

const resolveModeHint = (search: string): string => {
	if (search) {
		return PromptHistoryLabel.HINT_SEARCH;
	}

	return PromptHistoryLabel.HINT_BROWSE;
};

export { resolveModeHint };
