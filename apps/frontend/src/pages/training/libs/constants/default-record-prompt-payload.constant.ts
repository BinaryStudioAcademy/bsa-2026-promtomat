import { type PromptCreateRequestDto } from "~/modules/prompts/prompts.js";

const DEFAULT_RECORD_PROMPT_PAYLOAD: Pick<
	PromptCreateRequestDto,
	"promptBody" | "taskIntent"
> = {
	promptBody: "",
	taskIntent: "",
};

export { DEFAULT_RECORD_PROMPT_PAYLOAD };
