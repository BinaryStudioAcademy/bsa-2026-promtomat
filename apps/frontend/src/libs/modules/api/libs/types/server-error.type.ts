import { type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

import { type ErrorCode } from "~/libs/enums/enums.js";
import { type ServerErrorDetail, type ValueOf } from "~/libs/types/types.js";

type ServerCommonError = {
	code: ValueOf<typeof ErrorCode>;
	message: string;
	status: FetchBaseQueryError["status"];
};

type ServerError =
	ServerCommonError | ServerRateLimitError | ServerValidationError;

type ServerRateLimitError = {
	code: typeof ErrorCode.TOO_MANY_REQUESTS;
	message: string;
	retryAfterSeconds: null | number;
	status: FetchBaseQueryError["status"];
};

type ServerValidationError = {
	code: typeof ErrorCode.VALIDATION_FAILED;
	details: ServerErrorDetail[];
	message: string;
	status: FetchBaseQueryError["status"];
};

export {
	type ServerError,
	type ServerRateLimitError,
	type ServerValidationError,
};
