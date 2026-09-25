import { ZERO_VALUE } from "~/libs/constants/constants.js";

import { DAMPING_FACTOR, DECIMAL_PLACES } from "../constants/constants.js";

type ComputeDampedMeanParameters = {
	evaluationScores: number[];
	priorScore: null | number;
};

const computeDampedMean = ({
	evaluationScores,
	priorScore,
}: ComputeDampedMeanParameters): null | number => {
	if (evaluationScores.length === ZERO_VALUE) {
		return null;
	}

	const priorWeight = priorScore === null ? ZERO_VALUE : DAMPING_FACTOR;
	const sum = evaluationScores.reduce(
		(total, score) => total + score,
		ZERO_VALUE,
	);
	const mean =
		((priorScore ?? ZERO_VALUE) * priorWeight + sum) /
		(priorWeight + evaluationScores.length);

	return Number(mean.toFixed(DECIMAL_PLACES));
};

export { computeDampedMean };
