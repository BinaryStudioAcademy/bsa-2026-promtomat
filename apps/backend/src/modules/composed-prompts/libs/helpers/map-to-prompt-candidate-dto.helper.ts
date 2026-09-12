import { type NearestPrompt } from "~/modules/prompt-embeddings/libs/types/types.js";

import { type PromptCandidateDto } from "../types/types.js";

const mapToPromptCandidateDto = ({
	efficiencyScore,
	promptBody,
	promptId,
	taskIntent,
}: NearestPrompt): PromptCandidateDto => ({
	efficiencyScore,
	promptBody,
	promptId,
	taskIntent,
});

export { mapToPromptCandidateDto };
