import { type Embedding } from "~/libs/modules/embedding/embedding.js";

type NearestPromptQuery = {
	embedding: Embedding;
	limit: number;
	workspaceId: number;
};

export { type NearestPromptQuery };
