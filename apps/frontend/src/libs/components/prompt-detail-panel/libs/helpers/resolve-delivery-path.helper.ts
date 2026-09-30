import { AppRoute } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
import { type NavigableRoute } from "~/libs/types/types.js";

const resolveDeliveryPath = (
	id: number,
	isComposed: boolean,
): NavigableRoute => {
	if (isComposed) {
		return configureString(AppRoute.COMPOSED_PROMPTS_$COMPOSED_PROMPT_ID, {
			composedPromptId: String(id),
		}) as NavigableRoute;
	}

	return configureString(AppRoute.PROMPTS_$PROMPT_ID, {
		promptId: String(id),
	}) as NavigableRoute;
};

export { resolveDeliveryPath };
