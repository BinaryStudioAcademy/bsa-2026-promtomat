import { type PromptEmbeddingSource } from "./prompt-embedding-source.type.js";

type NearestPromptLabelsQuery = Pick<
	PromptEmbeddingSource,
	"promptBody" | "taskIntent"
> & { workspaceId: number };

export { type NearestPromptLabelsQuery };
