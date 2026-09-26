import { ErrorCode } from "~/libs/enums/enums.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";

const checkIsRecomposeLimitError = (error: unknown): boolean => {
	return (
		isServerError(error) && error.code === ErrorCode.RECOMPOSE_LIMIT_REACHED
	);
};

export { checkIsRecomposeLimitError };
