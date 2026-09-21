import { ApiTokenExpiration } from "~/libs/enums/enums.js";
import { type ApiTokenExpirationValue } from "~/libs/types/types.js";

import { MILLISECONDS_PER_DAY } from "../constants/constants.js";

const createExpirationDate = (
	expiration: ApiTokenExpirationValue,
): null | string => {
	if (expiration === ApiTokenExpiration.NEVER) {
		return null;
	}

	return new Date(Date.now() + expiration * MILLISECONDS_PER_DAY).toISOString();
};

export { createExpirationDate };
