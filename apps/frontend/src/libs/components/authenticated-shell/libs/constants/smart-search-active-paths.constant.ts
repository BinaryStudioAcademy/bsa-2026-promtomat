import { AppRoute } from "~/libs/enums/enums.js";

const SMART_SEARCH_ACTIVE_PATHS = [
	AppRoute.PROMPTS_$PROMPT_ID,
	AppRoute.PROMPTS_HISTORY,
	AppRoute.SMART_SEARCH,
] as const;

export { SMART_SEARCH_ACTIVE_PATHS };
