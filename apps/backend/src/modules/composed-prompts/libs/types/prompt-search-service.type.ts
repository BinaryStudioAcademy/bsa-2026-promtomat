import { type FindCandidatesQuery } from "./find-candidates-query.type.js";
import { type PromptCandidate } from "./prompt-candidate.type.js";

// Temporary: moves to #77's search module
type PromptSearchService = {
	findCandidates(query: FindCandidatesQuery): Promise<PromptCandidate[]>;
};

export { type PromptSearchService };
