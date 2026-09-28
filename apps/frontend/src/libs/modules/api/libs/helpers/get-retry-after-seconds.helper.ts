import { ZERO_VALUE } from "~/libs/constants/constants.js";
import { HTTPHeader } from "~/libs/enums/enums.js";

const getRetryAfterSeconds = (headers?: Headers): null | number => {
	const value = headers?.get(HTTPHeader.RETRY_AFTER);

	if (!value) {
		return null;
	}

	const seconds = Number(value);

	return Number.isSafeInteger(seconds) && seconds >= ZERO_VALUE
		? seconds
		: null;
};

export { getRetryAfterSeconds };
