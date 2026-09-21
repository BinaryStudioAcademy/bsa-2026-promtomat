import { type ValueOf } from "~/libs/types/types.js";

import { TOOLTIP_ALIGNMENT_SEGMENTS } from "../constants/constants.js";
import { TooltipAlignment } from "../enums/enums.js";

const getTooltipAlignment = (
	index: number,
	total: number,
): ValueOf<typeof TooltipAlignment> => {
	const edgeSize = total / TOOLTIP_ALIGNMENT_SEGMENTS;

	if (index < edgeSize) {
		return TooltipAlignment.START;
	}

	if (index >= total - edgeSize) {
		return TooltipAlignment.END;
	}

	return TooltipAlignment.CENTER;
};

export { getTooltipAlignment };
