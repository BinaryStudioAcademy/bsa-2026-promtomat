import { ZERO_VALUE } from "~/libs/constants/constants.js";

import { type PromptHistoryItem } from "../types/types.js";

const calculateAverageScore = (items: PromptHistoryItem[]): null | number => {
	const scoredItems = items
		.map(
			(item) =>
				item.computedScore ?? (item.score > ZERO_VALUE ? item.score : null),
		)
		.filter((score): score is number => score !== null);

	if (scoredItems.length === ZERO_VALUE) {
		return null;
	}

	const totalSum = scoredItems.reduce(
		(accumulator, score) => accumulator + score,
		ZERO_VALUE,
	);

	return totalSum / scoredItems.length;
};

export { calculateAverageScore };
