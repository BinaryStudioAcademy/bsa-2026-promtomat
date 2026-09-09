import { type PromptCreateRequestDto } from "~/modules/prompts/prompts.js";

const DEFAULT_RECORD_PROMT_PAYLOAD: Partial<PromptCreateRequestDto> = {
	promptBody: "",
	taskIntent: "",
};

export { DEFAULT_RECORD_PROMT_PAYLOAD };
