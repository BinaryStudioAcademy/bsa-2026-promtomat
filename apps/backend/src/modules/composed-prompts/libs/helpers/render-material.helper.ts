import {
	FIRST_SOURCE_NUMBER,
	LANGUAGE_REMINDER,
} from "../constants/constants.js";
import { type PromptCandidateDto } from "../types/types.js";

const renderSource = (candidate: PromptCandidateDto, index: number): string =>
	[
		`Source ${(index + FIRST_SOURCE_NUMBER).toString()}`,
		`Task intent: ${candidate.taskIntent}`,
		`Efficiency score: ${candidate.efficiencyScore.toString()}/10`,
		"Prompt:",
		candidate.promptBody,
	].join("\n");

const renderMaterial = (
	candidates: PromptCandidateDto[],
	description: string,
): string =>
	[
		...candidates.map((candidate, index) => renderSource(candidate, index)),
		`Task description:\n${description}`,
		LANGUAGE_REMINDER,
	].join("\n\n");

export { renderMaterial };
