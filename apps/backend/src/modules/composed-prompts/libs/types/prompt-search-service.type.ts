import { type FindCandidatesQuery } from "./find-candidates-query.type.js";
import { type PromptCandidateDto } from "./types.js";

// The retrieval contract agreed with #77: candidates in the search's ranking
// order (the material numbers the sources in that order), the "not close
// enough" threshold applied inside, full prompt bodies returned. The workspace
// access check is the route's, not this service's.
type PromptSearchService = {
	findCandidates(query: FindCandidatesQuery): Promise<PromptCandidateDto[]>;
};

export { type PromptSearchService };
