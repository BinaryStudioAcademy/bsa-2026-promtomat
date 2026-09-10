import {
	FIRST_SOURCE_NUMBER,
	LANGUAGE_REMINDER,
} from "../constants/constants.js";
import { type PromptCandidate } from "../types/types.js";

const renderSource = (candidate: PromptCandidate, index: number): string =>
	[
		`Source ${(index + FIRST_SOURCE_NUMBER).toString()}`,
		`Task intent: ${candidate.taskIntent}`,
		`Efficiency score: ${candidate.efficiencyScore.toString()}/10`,
		"Prompt:",
		candidate.promptBody,
	].join("\n");

const renderMaterial = (
	candidates: PromptCandidate[],
	description: string,
): string =>
	[
		...candidates.map((candidate, index) => renderSource(candidate, index)),
		`Task description:\n${description}`,
		LANGUAGE_REMINDER,
	].join("\n\n");

export { renderMaterial };
