import { TimeUnit } from "~/libs/enums/enums.js";

const EXPIRING_SOON_DAYS = 7;

const NO_TIME_REMAINING = 0;

const EXPIRING_SOON_MS = EXPIRING_SOON_DAYS * TimeUnit.MILLISECONDS_PER_DAY;

export { EXPIRING_SOON_MS, NO_TIME_REMAINING };
