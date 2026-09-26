import { Locale } from "~/libs/enums/enums.js";

import { DEFAULT_TIME_ZONE } from "../constants/constants.js";

const resolveTimeZone = (timeZone: string): string => {
	try {
		return new Intl.DateTimeFormat(Locale.EN_US, {
			timeZone,
		}).resolvedOptions().timeZone;
	} catch {
		return DEFAULT_TIME_ZONE;
	}
};

export { resolveTimeZone };
