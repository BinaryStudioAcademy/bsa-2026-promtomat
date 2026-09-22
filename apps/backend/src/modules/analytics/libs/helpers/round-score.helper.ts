import { ROUND_FACTOR } from "~/libs/constants/constants.js";

const roundScore = (score: number): number => {
	return Math.round(score * ROUND_FACTOR) / ROUND_FACTOR;
};

export { roundScore };
