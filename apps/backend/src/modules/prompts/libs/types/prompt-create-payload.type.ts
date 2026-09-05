import { type PromptCreateRequestDto } from "./types.js";

type PromptCreatePayload = PromptCreateRequestDto & { userId: number };

export { type PromptCreatePayload };
