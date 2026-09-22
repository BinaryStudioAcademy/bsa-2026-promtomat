import { format, isValid, parse } from "date-fns";

import { StreakDateFormat } from "../enums/enums.js";

const formatStreakDate = (date: string): string => {
	const parsedDate = parse(date, StreakDateFormat.INPUT, new Date());

	return isValid(parsedDate)
		? format(parsedDate, StreakDateFormat.DISPLAY)
		: date;
};

export { formatStreakDate };
