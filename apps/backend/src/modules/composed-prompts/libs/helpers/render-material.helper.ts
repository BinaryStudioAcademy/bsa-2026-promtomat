import {
	FIRST_SOURCE_NUMBER,
	LANGUAGE_REMINDER,
} from "../constants/constants.js";
import { type PromptCandidateDto } from "../types/types.js";
import { truncateSourceBody } from "./truncate-source-body.helper.js";

type Options = {
	candidates: PromptCandidateDto[];
	description: string;
	sourceBodyMaxLength: number;
};

const renderSource = (
	candidate: PromptCandidateDto,
	index: number,
	sourceBodyMaxLength: number,
): string =>
	[
		`Source ${(index + FIRST_SOURCE_NUMBER).toString()}`,
		`Task intent: ${candidate.taskIntent}`,
		`Efficiency score: ${candidate.efficiencyScore.toString()}/10`,
		"Prompt:",
		truncateSourceBody(candidate.promptBody, sourceBodyMaxLength),
	].join("\n");

const renderMaterial = ({
	candidates,
	description,
	sourceBodyMaxLength,
}: Options): string =>
	[
		...candidates.map((candidate, index) =>
			renderSource(candidate, index, sourceBodyMaxLength),
		),
		`Task description:\n${description}`,
		LANGUAGE_REMINDER,
	].join("\n\n");

export { renderMaterial };
