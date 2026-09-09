import {
	MAX_EFFICIENCY_SCORE,
	MAX_SIMILARITY,
	RELEVANCE_WEIGHTS,
	SIMILARITY_THRESHOLD,
} from "../constants/constants.js";

const computeRelevance = ({
	distance,
	efficiencyScore,
}: {
	distance: number;
	efficiencyScore: number;
}): number => {
	const similarity = MAX_SIMILARITY - distance / SIMILARITY_THRESHOLD;

	return (
		RELEVANCE_WEIGHTS.SIMILARITY_WEIGHT * similarity +
		RELEVANCE_WEIGHTS.EFFICIENCY_SCORE_WEIGHT *
			(efficiencyScore / MAX_EFFICIENCY_SCORE)
	);
};

export { computeRelevance };
