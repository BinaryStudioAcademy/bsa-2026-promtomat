import { FIRST_SOURCE_NUMBER } from "../constants/constants.js";
import {
	type ComposedPromptSourceDto,
	type PromptCandidateDto,
} from "../types/types.js";

const selectUsedSources = (
	candidates: PromptCandidateDto[],
	usedSources: number[],
): ComposedPromptSourceDto[] => {
	const selected = new Set(
		usedSources.filter(
			(sourceNumber) =>
				Number.isSafeInteger(sourceNumber) &&
				sourceNumber >= FIRST_SOURCE_NUMBER &&
				sourceNumber <= candidates.length,
		),
	);

	return [...selected]
		.toSorted((left, right) => left - right)
		.flatMap((sourceNumber) => {
			const candidate = candidates.at(sourceNumber - FIRST_SOURCE_NUMBER);

			return candidate
				? [
						{
							efficiencyScore: candidate.efficiencyScore,
							promptId: candidate.promptId,
							rank: sourceNumber,
							taskIntent: candidate.taskIntent,
						},
					]
				: [];
		});
};

export { selectUsedSources };
