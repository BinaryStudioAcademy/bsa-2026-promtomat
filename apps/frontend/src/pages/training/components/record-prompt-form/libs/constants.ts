import { type PromptCreateRequestDto } from "~/modules/prompts/prompts.js";

const DEFAULT_RECORD_PROMT_PAYLOAD: Pick<
	PromptCreateRequestDto,
	"promptBody" | "taskIntent"
> = {
	promptBody: "",
	taskIntent: "",
};

export { DEFAULT_RECORD_PROMT_PAYLOAD };
