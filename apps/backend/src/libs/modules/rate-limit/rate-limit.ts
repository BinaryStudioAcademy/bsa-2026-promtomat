import { config } from "~/libs/modules/config/config.js";

import { InMemoryRateLimitService } from "./in-memory-rate-limit.service.js";

const MILLISECONDS_IN_MINUTE = 60_000;

const PASSWORD_RESET_MAXIMUM_TRACKED_KEYS = 10_000;

const passwordResetRateLimit = new InMemoryRateLimitService({
	intervalMs: config.ENV.PASSWORD_RESET.WINDOW_MINUTES * MILLISECONDS_IN_MINUTE,
	limit: config.ENV.PASSWORD_RESET.REQUEST_LIMIT,
	maximumTrackedKeys: PASSWORD_RESET_MAXIMUM_TRACKED_KEYS,
});

export { passwordResetRateLimit };
export { type RateLimitService } from "./libs/types/types.js";
