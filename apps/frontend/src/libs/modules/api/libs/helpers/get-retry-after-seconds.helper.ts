import { ZERO_VALUE } from "~/libs/constants/constants.js";
import { HTTPHeader, TimeUnit } from "~/libs/enums/enums.js";

const getDelaySeconds = (value: string): null | number => {
	const seconds = Number(value);

	return Number.isSafeInteger(seconds) && seconds >= ZERO_VALUE
		? seconds
		: null;
};

const getSecondsUntilDate = (value: string): null | number => {
	const timestamp = Date.parse(value);

	if (Number.isNaN(timestamp)) {
		return null;
	}

	const remainingSeconds = Math.ceil(
		(timestamp - Date.now()) / TimeUnit.MILLISECONDS_PER_SECOND,
	);

	return Math.max(ZERO_VALUE, remainingSeconds);
};

const getRetryAfterSeconds = (headers?: Headers): null | number => {
	const value = headers?.get(HTTPHeader.RETRY_AFTER);

	if (!value) {
		return null;
	}

	if (Number.isNaN(Number(value))) {
		return getSecondsUntilDate(value);
	}

	return getDelaySeconds(value);
};

export { getRetryAfterSeconds };
