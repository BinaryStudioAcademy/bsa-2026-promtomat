import { ZERO_VALUE } from "~/libs/constants/constants.js";
import { type PromptItemResponseDto } from "~/modules/prompts/libs/types/types.js";

type Parameters = {
	isComposed: boolean;
	isOwner: boolean;
	prompt: PromptItemResponseDto;
};

type ResolvedScores = {
	displayScore: null | number;
	selectedScore: null | number;
};

const resolvePromptScores = ({
	isComposed,
	isOwner,
	prompt,
}: Parameters): ResolvedScores => {
	const rawScore =
		!isComposed && prompt.score !== null && prompt.score > ZERO_VALUE
			? prompt.score
			: null;

	return {
		displayScore: prompt.computedScore ?? rawScore,
		selectedScore: prompt.myScore ?? (isOwner ? rawScore : null),
	};
};

export { resolvePromptScores };
