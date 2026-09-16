import { type ComposedPromptSourceDto } from "./composed-prompt-source-dto.type.js";

type ComposedPromptDto = {
	body: string;
	createdAt: string;
	description: string;
	explanation: string;
	id: number;
	modelId: string;
	sources: ComposedPromptSourceDto[];
	workspaceId: number;
};

export { type ComposedPromptDto };
