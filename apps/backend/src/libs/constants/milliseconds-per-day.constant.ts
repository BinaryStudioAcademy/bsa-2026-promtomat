import { TimeUnit } from "~/libs/enums/enums.js";

const MILLISECONDS_PER_DAY =
	TimeUnit.HOURS_PER_DAY *
	TimeUnit.MINUTES_PER_HOUR *
	TimeUnit.SECONDS_PER_MINUTE *
	TimeUnit.MILLISECONDS_PER_SECOND;

export { MILLISECONDS_PER_DAY };
