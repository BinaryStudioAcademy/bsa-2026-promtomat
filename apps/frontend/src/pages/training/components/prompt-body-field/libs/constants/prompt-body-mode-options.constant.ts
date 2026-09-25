import { PromptBodyFieldMessage, PromptBodyMode } from "../enums/enums.js";

const PROMPT_BODY_MODE_OPTIONS = [
	{ label: PromptBodyFieldMessage.WRITE, value: PromptBodyMode.WRITE },
	{ label: PromptBodyFieldMessage.PREVIEW, value: PromptBodyMode.PREVIEW },
] as const;

export { PROMPT_BODY_MODE_OPTIONS };
