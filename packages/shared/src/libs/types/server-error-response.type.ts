import { type ErrorCode } from "../enums/error-code.enum.js";
import { type ServerErrorDetail } from "./server-error-detail.type.js";
import { type ValueOf } from "./value-of.type.js";

type ServerCommonErrorResponse = {
	code: ValueOf<typeof ErrorCode>;
	message: string;
};

type ServerErrorResponse =
	ServerCommonErrorResponse | ServerValidationErrorResponse;

type ServerValidationErrorResponse = {
	code: typeof ErrorCode.VALIDATION_FAILED;
	details: ServerErrorDetail[];
	message: string;
};

export {
	type ServerCommonErrorResponse,
	type ServerErrorResponse,
	type ServerValidationErrorResponse,
};
