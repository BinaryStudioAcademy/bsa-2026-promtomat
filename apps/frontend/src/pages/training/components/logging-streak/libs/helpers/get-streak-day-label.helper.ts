import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { DateFormat, Locale } from "~/libs/enums/enums.js";
import { formatDate } from "~/libs/helpers/helpers.js";

import { LoggingStreakMessage } from "../enums/enums.js";
import { type StreakDay } from "../types/types.js";

const cardinalRules = new Intl.PluralRules(Locale.EN_US);

const getStreakDayLabel = ({ date, logCount }: StreakDay): string => {
	const formattedDate = formatDate(date, DateFormat.FULL_MONTH_DAY);

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
