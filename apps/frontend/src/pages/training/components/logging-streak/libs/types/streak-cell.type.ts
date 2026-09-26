import { type ValueOf } from "~/libs/types/types.js";

import { type TooltipAlignment } from "../enums/enums.js";

type StreakCell = {
	alignment: ValueOf<typeof TooltipAlignment>;
	date: string;
	intensity: number;
	label: string;
};

export { type StreakCell };
