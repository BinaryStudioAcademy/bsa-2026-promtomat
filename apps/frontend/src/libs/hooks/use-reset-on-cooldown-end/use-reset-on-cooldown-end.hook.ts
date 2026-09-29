import { useEffect } from "react";

import { TimeUnit } from "~/libs/enums/enums.js";
import { checkIsRateLimitError } from "~/libs/modules/api/libs/helpers/check-is-rate-limit-error.helper.js";

const useResetOnCooldownEnd = (error: unknown, reset: () => void): void => {
	useEffect(() => {
		if (!checkIsRateLimitError(error) || error.retryAfterSeconds === null) {
			return;
		}

		const timeoutId = setTimeout(
			reset,
			error.retryAfterSeconds * TimeUnit.MILLISECONDS_PER_SECOND,
		);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [error, reset]);
};

export { useResetOnCooldownEnd };
