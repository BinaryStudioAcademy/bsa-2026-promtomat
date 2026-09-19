import { type Embedding } from "~/libs/modules/embedding/embedding.js";

type PromptSemanticSearchQuery = {
	embedding: Embedding;
	limit: number;
	offset: number;
	score?: number | undefined;
	userId: number;
	workspaceId?: number | undefined;
};

export { type PromptSemanticSearchQuery };
