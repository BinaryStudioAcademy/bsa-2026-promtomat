import { type FindCandidatesQuery } from "./find-candidates-query.type.js";
import { type PromptCandidateDto } from "./types.js";

type PromptSearchService = {
	findCandidates(query: FindCandidatesQuery): Promise<PromptCandidateDto[]>;
};

export { type PromptSearchService };
