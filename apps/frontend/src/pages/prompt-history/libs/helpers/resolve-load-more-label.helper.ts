import { PromptHistoryLabel } from "../enums/prompt-history-label.enum.js";

const resolveLoadMoreLabel = (
	isFetching: boolean,
	isError: boolean,
): string => {
	if (isFetching) {
		return PromptHistoryLabel.LOADING;
	}

	if (isError) {
		return PromptHistoryLabel.RETRY;
	}

	return PromptHistoryLabel.LOAD_MORE;
};

export { resolveLoadMoreLabel };
