import { getPreviousUtcDate } from "~/libs/helpers/helpers.js";

import { DEFAULT_TIME_ZONE } from "../constants/constants.js";
import { formatDateInTimeZone } from "./format-date-in-time-zone.helper.js";

const getPreviousDate = (date: string): string => {
	return formatDateInTimeZone(
		getPreviousUtcDate(new Date(date)),
		DEFAULT_TIME_ZONE,
	);
};

export { getPreviousDate };
