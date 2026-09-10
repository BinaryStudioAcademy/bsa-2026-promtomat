import { type PromptCandidateDto } from "./types.js";

// Temporary: moves to #77's search module together with `PromptSearchService`.
type PromptCandidate = PromptCandidateDto & {
	distance: number;
	relevance: number;
};

export { type PromptCandidate };
