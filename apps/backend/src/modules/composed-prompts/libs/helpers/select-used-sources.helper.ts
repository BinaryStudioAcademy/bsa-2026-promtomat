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
	const [firstSelected] = selected;
	const sourceNumbers =
		firstSelected === undefined
			? candidates.map((_, index) => index + FIRST_SOURCE_NUMBER)
			: [...selected].toSorted((left, right) => left - right);

	return sourceNumbers.flatMap((sourceNumber) => {
		const candidate = candidates.at(sourceNumber - FIRST_SOURCE_NUMBER);

		return candidate
			? [
					{
						promptId: candidate.promptId,
						rank: sourceNumber,
						taskIntent: candidate.taskIntent,
					},
				]
			: [];
	});
};

export { selectUsedSources };
