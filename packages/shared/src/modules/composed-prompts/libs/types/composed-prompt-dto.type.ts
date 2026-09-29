import { type ComposedPromptSourceDto } from "./composed-prompt-source-dto.type.js";

type ComposedPromptDto = {
	body: string;
	computedScore: null | number;
	createdAt: string;
	description: string;
	explanation: string;
	id: number;
	modelId: string;
	myScore?: null | number;
	sources: ComposedPromptSourceDto[];
	workspaceId: number;
};

export { type ComposedPromptDto };
