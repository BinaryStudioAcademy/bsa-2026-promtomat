import { type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

import { UNKNOWN_ERROR_MESSAGE } from "../constants/constants.js";
import { FetchErrorMessage } from "../enums/enums.js";

const getFetchErrorMessage = (
	status: FetchBaseQueryError["status"],
): string => {
	if (typeof status === "string") {
		return FetchErrorMessage[status];
	}

	return UNKNOWN_ERROR_MESSAGE;
};

export { getFetchErrorMessage };
