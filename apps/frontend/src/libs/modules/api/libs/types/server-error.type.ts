import { type ErrorCode } from "~/libs/enums/enums.js";
import { type ServerErrorDetail, type ValueOf } from "~/libs/types/types.js";

type ServerCommonError = {
	code: ServerCommonErrorCode;
	status: number;
};

type ServerCommonErrorCode = Exclude<
	ValueOf<typeof ErrorCode>,
	typeof ErrorCode.VALIDATION_FAILED
>;

type ServerError = ServerCommonError | ServerValidationError;

type ServerValidationError = {
	code: typeof ErrorCode.VALIDATION_FAILED;
	details: ServerErrorDetail[];
	status: number;
};

export { type ServerError, type ServerValidationError };
