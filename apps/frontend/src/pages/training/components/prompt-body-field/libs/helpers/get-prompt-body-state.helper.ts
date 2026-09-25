import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { type ValueOf } from "~/libs/types/types.js";

import { PromptBodyMode, PromptBodyState } from "../enums/enums.js";

type Parameters = {
	characterCount: number;
	mode: ValueOf<typeof PromptBodyMode>;
};

const getPromptBodyState = ({
	characterCount,
	mode,
}: Parameters): ValueOf<typeof PromptBodyState> => {
	if (mode === PromptBodyMode.WRITE) {
		return PromptBodyState.WRITE;
	}

	return characterCount === EMPTY_LENGTH
		? PromptBodyState.EMPTY_PREVIEW
		: PromptBodyState.PREVIEW;
};

export { getPromptBodyState };
