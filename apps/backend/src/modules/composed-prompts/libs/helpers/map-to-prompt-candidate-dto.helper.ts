import { type PromptCandidateDto } from "../types/types.js";

const mapToPromptCandidateDto = ({
	efficiencyScore,
	promptBody,
	promptId,
	taskIntent,
}: PromptCandidateDto): PromptCandidateDto => ({
	efficiencyScore,
	promptBody,
	promptId,
	taskIntent,
});

export { mapToPromptCandidateDto };
