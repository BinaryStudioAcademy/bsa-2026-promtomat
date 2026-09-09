import { type NearestPrompt } from "~/modules/prompt-embeddings/libs/types/types.js";

type PromptCandidate = NearestPrompt & { relevance: number };

export { type PromptCandidate };
