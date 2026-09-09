import { type PromptEmbeddingSource } from "./prompt-embedding-source.type.js";

type IndexedPromptSource = PromptEmbeddingSource & {
	modelId: null | string;
	sourceHash: null | string;
};

export { type IndexedPromptSource };
