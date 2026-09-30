import { FIRST_ELEMENT_INDEX, ZERO_VALUE } from "~/libs/constants/constants.js";
import { type AnalyticsDistributionResponseDto } from "~/modules/analytics/libs/types/types.js";

import {
	DISTRIBUTION_TIERS,
	PERCENTAGE_MAX,
	PERCENTAGE_POINT,
} from "../constants/constants.js";
import { type DistributionPercentages } from "../types/types.js";
import { getScoredCount } from "./get-scored-count.helper.js";

type BandShare = {
	key: keyof DistributionPercentages;
	remainder: number;
	wholePercentage: number;
};

const getDistributionPercentages = (
	distribution: AnalyticsDistributionResponseDto,
): DistributionPercentages => {
	const percentages: DistributionPercentages = {
		high: ZERO_VALUE,
		low: ZERO_VALUE,
		mid: ZERO_VALUE,
	};
	const total = getScoredCount(distribution);

	if (total === ZERO_VALUE) {
		return percentages;
	}

	const shares = DISTRIBUTION_TIERS.map(({ key }): BandShare => {
		const exactPercentage = (distribution[key].count / total) * PERCENTAGE_MAX;
		const wholePercentage = Math.floor(exactPercentage);

		return {
			key,
			remainder: exactPercentage - wholePercentage,
			wholePercentage,
		};
	});

	let missingPoints = PERCENTAGE_MAX;

	for (const share of shares) {
		percentages[share.key] = share.wholePercentage;
		missingPoints -= share.wholePercentage;
	}

	const sharesByRemainder = shares.toSorted(
		(first, second) => second.remainder - first.remainder,
	);

	for (const share of sharesByRemainder.slice(
		FIRST_ELEMENT_INDEX,
		missingPoints,
	)) {
		percentages[share.key] += PERCENTAGE_POINT;
	}

	return percentages;
};

export { getDistributionPercentages };
