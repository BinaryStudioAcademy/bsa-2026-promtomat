import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { DateFormat, Locale } from "~/libs/enums/enums.js";
import { formatDate } from "~/libs/helpers/helpers.js";
import { type PromptStreakDayDto } from "~/modules/prompts/libs/types/types.js";

import { LoggingStreakMessage } from "../enums/enums.js";

const cardinalRules = new Intl.PluralRules(Locale.EN_US);

const getStreakDayLabel = ({
	date,
	promptCount,
}: PromptStreakDayDto): string => {
	const formattedDate = formatDate(date, DateFormat.FULL_MONTH_DAY);

	if (promptCount === EMPTY_LENGTH) {
		return `${LoggingStreakMessage.LOG_NONE} ${LoggingStreakMessage.ON} ${formattedDate}.`;
	}

	const unit =
		cardinalRules.select(promptCount) === "one"
			? LoggingStreakMessage.LOG_ONE
			: LoggingStreakMessage.LOG_OTHER;

	return `${String(promptCount)} ${unit} ${LoggingStreakMessage.ON} ${formattedDate}.`;
};

export { getStreakDayLabel };
