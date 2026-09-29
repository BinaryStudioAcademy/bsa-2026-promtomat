import { configureString } from "~/libs/helpers/helpers.js";

import { PROMPT_PAGE_PATH } from "../constants/constants.js";

const getPromptUrl = (webUrl: string, promptId: number): string =>
	`${webUrl}${configureString(PROMPT_PAGE_PATH, { promptId: String(promptId) })}`;

export { getPromptUrl };
