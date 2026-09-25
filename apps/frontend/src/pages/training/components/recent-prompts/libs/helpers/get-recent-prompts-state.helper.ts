import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type PromptRecentDto } from "~/modules/prompts/prompts.js";

import { RecentPromptsState } from "../enums/enums.js";

type Parameters = {
	isError: boolean;
	items: PromptRecentDto[] | undefined;
	workspaceId: number | undefined;
};

const getRecentPromptsState = ({
	isError,
	items,
	workspaceId,
}: Parameters): ValueOf<typeof RecentPromptsState> => {
	if (workspaceId === undefined) {
		return RecentPromptsState.NO_WORKSPACE;
	}

	if (isError) {
		return RecentPromptsState.ERROR;
	}

	if (!items) {
		return RecentPromptsState.LOADING;
	}

	return items.length === EMPTY_LENGTH
		? RecentPromptsState.EMPTY
		: RecentPromptsState.READY;
};

export { getRecentPromptsState };
