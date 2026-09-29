import { SINGLE_RECOMPOSITION_COUNT } from "../constants/constants.js";
import { GenerateLabel } from "../enums/enums.js";

const getRecompositionsLeftLabel = (
	remainingRecompositions: number,
): string => {
	const noun =
		remainingRecompositions === SINGLE_RECOMPOSITION_COUNT
			? GenerateLabel.RECOMPOSITION_ONE
			: GenerateLabel.RECOMPOSITIONS_MANY;

	return [
		String(remainingRecompositions),
		noun,
		GenerateLabel.RECOMPOSITIONS_LEFT,
	].join(" ");
};

export { getRecompositionsLeftLabel };
