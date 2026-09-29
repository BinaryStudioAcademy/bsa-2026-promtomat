import { AppRoute } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
import { type NavigableRoute } from "~/libs/types/types.js";

const getPromptRoute = (promptId: number): NavigableRoute =>
	configureString(AppRoute.PROMPTS_$PROMPT_ID, {
		promptId: String(promptId),
	}) as NavigableRoute;

export { getPromptRoute };
