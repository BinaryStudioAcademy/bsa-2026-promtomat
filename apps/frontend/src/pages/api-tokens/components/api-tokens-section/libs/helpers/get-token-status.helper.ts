import { type ValueOf } from "~/libs/types/types.js";

import { EXPIRING_SOON_MS, NO_TIME_REMAINING } from "../constants/constants.js";
import { ApiTokenStatus } from "../enums/enums.js";

const getTokenStatus = (
	expiresAt: null | string,
): ValueOf<typeof ApiTokenStatus> => {
	if (expiresAt === null) {
		return ApiTokenStatus.ACTIVE;
	}

	const remaining = new Date(expiresAt).getTime() - Date.now();

	if (remaining <= NO_TIME_REMAINING) {
		return ApiTokenStatus.EXPIRED;
	}

	if (remaining <= EXPIRING_SOON_MS) {
		return ApiTokenStatus.EXPIRING;
	}

	return ApiTokenStatus.ACTIVE;
};

export { getTokenStatus };
