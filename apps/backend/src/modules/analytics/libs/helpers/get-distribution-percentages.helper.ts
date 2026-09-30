import {
	FIRST_ELEMENT_INDEX,
	PERCENTAGE_MULTIPLIER,
	ZERO_VALUE,
} from "~/libs/constants/constants.js";

import {
	DISTRIBUTION_BANDS,
	PERCENTAGE_POINT,
} from "../constants/constants.js";
import {
	type DistributionPercentages,
	type PromptDistributionCountRow,
} from "../types/types.js";

type BandShare = {
	band: keyof DistributionPercentages;
	remainder: number;
	wholePercentage: number;
};

const getDistributionPercentages = (
	counts: PromptDistributionCountRow,
): DistributionPercentages => {
	const percentages: DistributionPercentages = {
		high: ZERO_VALUE,
		low: ZERO_VALUE,
		mid: ZERO_VALUE,
	};
	const total = counts.high + counts.mid + counts.low;

	if (total === ZERO_VALUE) {
		return percentages;
	}

	const shares = DISTRIBUTION_BANDS.map((band): BandShare => {
		const exactPercentage = (counts[band] / total) * PERCENTAGE_MULTIPLIER;
		const wholePercentage = Math.floor(exactPercentage);

		return {
			band,
			remainder: exactPercentage - wholePercentage,
			wholePercentage,
		};
	});

	let missingPoints = PERCENTAGE_MULTIPLIER;

	for (const share of shares) {
		percentages[share.band] = share.wholePercentage;
		missingPoints -= share.wholePercentage;
	}

	const sharesByRemainder = shares.toSorted(
		(first, second) => second.remainder - first.remainder,
	);

	for (const share of sharesByRemainder.slice(
		FIRST_ELEMENT_INDEX,
		missingPoints,
	)) {
		percentages[share.band] += PERCENTAGE_POINT;
	}

	return percentages;
};

export { getDistributionPercentages };
