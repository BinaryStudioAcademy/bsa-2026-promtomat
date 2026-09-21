import { type ApiTokenExpirationValue } from "~/libs/types/types.js";

import { MILLISECONDS_PER_DAY } from "../constants/constants.js";

const createExpirationDate = (expiration: ApiTokenExpirationValue): string => {
	return new Date(Date.now() + expiration * MILLISECONDS_PER_DAY).toISOString();
};

export { createExpirationDate };
