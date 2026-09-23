import { AxisStep } from "../enums/enums.js";

const AXIS_STEPS = Object.values(AxisStep).toSorted(
	(first, second) => first - second,
);

export { AXIS_STEPS };
