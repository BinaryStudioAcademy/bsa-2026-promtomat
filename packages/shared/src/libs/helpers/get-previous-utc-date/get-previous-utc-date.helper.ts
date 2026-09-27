import { SINGLE_DAY } from "../../constants/constants.js";

const getPreviousUtcDate = (date: Date): Date => {
	const previous = new Date(date);

	previous.setUTCDate(previous.getUTCDate() - SINGLE_DAY);

	return previous;
};

export { getPreviousUtcDate };
