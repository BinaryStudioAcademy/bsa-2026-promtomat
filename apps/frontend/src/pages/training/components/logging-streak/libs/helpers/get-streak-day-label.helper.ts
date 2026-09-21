import { EMPTY_LENGTH } from "~/libs/constants/constants.js";

import { STREAK_LOCALE } from "../constants/constants.js";
import { LoggingStreakMessage } from "../enums/enums.js";
import { type StreakDay } from "../types/types.js";
import { formatStreakDate } from "./format-streak-date.helper.js";

const cardinalRules = new Intl.PluralRules(STREAK_LOCALE);

const getStreakDayLabel = ({ date, logCount }: StreakDay): string => {
	const formattedDate = formatStreakDate(date);

	if (logCount === EMPTY_LENGTH) {
		return `${LoggingStreakMessage.LOG_NONE} ${LoggingStreakMessage.ON} ${formattedDate}.`;
	}

	const unit =
		cardinalRules.select(logCount) === "one"
			? LoggingStreakMessage.LOG_ONE
			: LoggingStreakMessage.LOG_OTHER;

	return `${String(logCount)} ${unit} ${LoggingStreakMessage.ON} ${formattedDate}.`;
};

export { getStreakDayLabel };
