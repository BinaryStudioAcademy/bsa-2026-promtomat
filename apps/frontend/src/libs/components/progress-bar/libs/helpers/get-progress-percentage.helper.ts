const PERCENTAGE_SCALE = 100;
const EMPTY_TARGET = 0;

const getProgressPercentage = (count: number, target: number): number => {
	if (target <= EMPTY_TARGET) {
		return EMPTY_TARGET;
	}

	return Math.min(PERCENTAGE_SCALE, (count / target) * PERCENTAGE_SCALE);
};

export { EMPTY_TARGET, getProgressPercentage, PERCENTAGE_SCALE };
