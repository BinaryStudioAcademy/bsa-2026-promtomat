import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";

const formatDateInTimeZone = (
	date: Date,
	timeZone: string,
	formatPattern: string,
): string => {
	return format(new TZDate(date, timeZone), formatPattern);
};

export { formatDateInTimeZone };
