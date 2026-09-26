import { type PromptUpdateScoreRequestDto } from "@promptomat/shared";

type PromptUpdateScorePayload = PromptUpdateScoreRequestDto & { id: number };

export { type PromptUpdateScorePayload };
