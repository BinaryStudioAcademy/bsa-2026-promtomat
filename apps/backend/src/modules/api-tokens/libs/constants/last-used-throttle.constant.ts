import { TimeUnit } from "~/libs/enums/enums.js";

const LAST_USED_THROTTLE_MINUTES = 5;

const LAST_USED_THROTTLE_MS =
	LAST_USED_THROTTLE_MINUTES * TimeUnit.MILLISECONDS_PER_MINUTE;

export { LAST_USED_THROTTLE_MS };
