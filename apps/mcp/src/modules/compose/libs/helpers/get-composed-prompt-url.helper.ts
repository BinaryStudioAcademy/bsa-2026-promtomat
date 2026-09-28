import { configureString } from "~/libs/helpers/helpers.js";

import { COMPOSED_PROMPT_PAGE_PATH } from "../constants/constants.js";

const getComposedPromptUrl = (
	webUrl: string,
	composedPromptId: number,
): string =>
	`${webUrl}${configureString(COMPOSED_PROMPT_PAGE_PATH, { composedPromptId: String(composedPromptId) })}`;

export { getComposedPromptUrl };
