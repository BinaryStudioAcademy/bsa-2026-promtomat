import { ApiTokenStatus } from "./api-token-status.enum.js";

const ApiTokenStatusClass = {
	[ApiTokenStatus.ACTIVE]: "pill-active",
	[ApiTokenStatus.EXPIRED]: "pill-expired",
	[ApiTokenStatus.EXPIRING]: "pill-expiring",
} as const;

export { ApiTokenStatusClass };
