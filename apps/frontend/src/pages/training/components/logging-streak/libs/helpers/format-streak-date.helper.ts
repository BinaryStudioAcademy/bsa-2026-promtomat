import { formatDate } from "~/libs/helpers/helpers.js";

import { StreakDateFormat } from "../enums/enums.js";

const formatStreakDate = (date: string): string => {
	return formatDate(date, StreakDateFormat.DISPLAY);
};

export { formatStreakDate };
