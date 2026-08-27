import { type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

import { type ServerErrorType } from "~/libs/enums/enums.js";
import { type ServerErrorDetail } from "~/libs/types/types.js";

type ServerCommonError = {
	code?: string | undefined;
	errorType: typeof ServerErrorType.COMMON;
	message: string;
	status: FetchBaseQueryError["status"];
};

type ServerError = ServerCommonError | ServerValidationError;

type ServerValidationError = {
	details: ServerErrorDetail[];
	errorType: typeof ServerErrorType.VALIDATION;
	message: string;
	status: FetchBaseQueryError["status"];
};

export { type ServerError, type ServerValidationError };
