import { type PromptCreateRequestDto } from "~/modules/prompts/prompts.js";

type ComposedBodyEditDto = Pick<PromptCreateRequestDto, "promptBody">;

export { type ComposedBodyEditDto };
