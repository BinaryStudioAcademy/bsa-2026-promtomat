import { AppRoute } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";
import { PromptProgress } from "~/modules/prompts/prompts.js";

const getWorkspaceOpenDestination = (
	promptCount: number,
): ValueOf<typeof AppRoute> => {
	return promptCount < PromptProgress.TARGET_COUNT
		? AppRoute.TRAINING
		: AppRoute.GENERATE;
};

export { getWorkspaceOpenDestination };
