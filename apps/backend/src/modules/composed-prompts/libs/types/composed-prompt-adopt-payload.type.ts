import { type ComposedPromptAdoptRequestDto } from "./types.js";

type ComposedPromptAdoptPayload = ComposedPromptAdoptRequestDto & {
	id: number;
	userId: number;
};

export { type ComposedPromptAdoptPayload };
