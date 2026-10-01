import { PromptHistoryLabel } from "../enums/prompt-history-label.enum.js";

const SINGLE_RESULT_COUNT = 1;

const resolveResultCountLabel = (count: number): string => {
	if (count === SINGLE_RESULT_COUNT) {
		return `${String(count)} ${PromptHistoryLabel.RESULT}`;
	}

	return `${String(count)} ${PromptHistoryLabel.RESULTS}`;
};

export { resolveResultCountLabel };
