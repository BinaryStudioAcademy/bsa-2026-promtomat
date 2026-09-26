import { DateFormat } from "~/libs/enums/enums.js";
import {
	formatDateInTimeZone,
	getPreviousUtcDate,
} from "~/libs/helpers/helpers.js";

import { DEFAULT_TIME_ZONE } from "../constants/constants.js";

const getPreviousDate = (date: string): string => {
	return formatDateInTimeZone(
		getPreviousUtcDate(new Date(date)),
		DEFAULT_TIME_ZONE,
		DateFormat.ISO_DATE,
	);
};

export { getPreviousDate };
