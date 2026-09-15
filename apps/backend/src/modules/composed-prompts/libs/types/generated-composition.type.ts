import { type ComposedPromptSourceDto } from "./types.js";

type GeneratedComposition = {
	body: string;
	explanation: string;
	sources: ComposedPromptSourceDto[];
};

export { type GeneratedComposition };
