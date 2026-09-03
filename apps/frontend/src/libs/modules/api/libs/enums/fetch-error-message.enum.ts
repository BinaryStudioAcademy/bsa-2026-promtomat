import { type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

import { UNKNOWN_ERROR_MESSAGE } from "../constants/constants.js";

type FetchErrorStatus = Extract<FetchBaseQueryError["status"], string>;

const FetchErrorMessage = {
	CUSTOM_ERROR: UNKNOWN_ERROR_MESSAGE,
	FETCH_ERROR: "Can't reach the server. Please try again.",
	PARSING_ERROR: UNKNOWN_ERROR_MESSAGE,
	TIMEOUT_ERROR: "The request took too long. Please try again.",
} satisfies Record<FetchErrorStatus, string>;

export { FetchErrorMessage };
