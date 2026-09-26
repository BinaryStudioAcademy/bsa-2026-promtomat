import { type PromptUpdateBodyRequestDto } from "@promptomat/shared";

type PromptUpdateBodyPayload = PromptUpdateBodyRequestDto & { id: number };

export { type PromptUpdateBodyPayload };
