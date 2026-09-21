import { type ValueOf } from "~/libs/types/types.js";
import { type TooltipAlignment } from "~/pages/training/components/logging-streak/libs/enums/enums.js";

type StreakCell = {
	alignment: ValueOf<typeof TooltipAlignment>;
	id: number;
	intensity: number;
	label: string;
};

export { type StreakCell };
