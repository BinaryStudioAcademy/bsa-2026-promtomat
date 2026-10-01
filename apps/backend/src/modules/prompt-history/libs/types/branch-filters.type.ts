import { type Embedding } from "~/libs/modules/embedding/embedding.js";

type BranchFilters = {
	embedding: Embedding | null;
	qualityTier?: string | undefined;
	search?: string | undefined;
	userId: number;
	workspaceId: number;
};

export { type BranchFilters };
