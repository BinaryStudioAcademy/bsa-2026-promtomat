import { type PromptUpdateScoreRequestDto } from "./types.js";

type PromptUpdateScorePayload = PromptUpdateScoreRequestDto & { id: number };

export { type PromptUpdateScorePayload };
