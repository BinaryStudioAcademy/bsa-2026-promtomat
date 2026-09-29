import { ErrorCode } from "~/libs/enums/enums.js";
import { checkIsServerError } from "~/libs/modules/api/libs/helpers/check-is-server-error.helper.js";

const checkIsRecomposeLimitError = (error: unknown): boolean => {
	return (
		checkIsServerError(error) &&
		error.code === ErrorCode.RECOMPOSE_LIMIT_REACHED
	);
};

export { checkIsRecomposeLimitError };
