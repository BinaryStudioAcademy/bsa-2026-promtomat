import { type NearestPrompt } from "~/modules/prompt-embeddings/libs/types/types.js";

import {
	type PromptSearchResponseDto,
	type PromptSearchResult,
} from "../types/types.js";

const toPromptSearchResponseDto = (
	promptCandidates: NearestPrompt[],
): PromptSearchResponseDto => ({
	items: promptCandidates.map((promptCandidate): PromptSearchResult => ({
		efficiencyScore: promptCandidate.efficiencyScore,
		promptId: promptCandidate.promptId,
		taskIntent: promptCandidate.taskIntent,
	})),
});

export { toPromptSearchResponseDto };
