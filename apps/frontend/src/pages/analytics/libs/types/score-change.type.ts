import { type ValueOf } from "~/libs/types/types.js";

import { type MetricTone } from "../enums/enums.js";

type ScoreChange = {
	caption: string;
	tone: ValueOf<typeof MetricTone>;
	value: string;
};

export { type ScoreChange };
