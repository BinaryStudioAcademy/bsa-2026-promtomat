import { TokenErrorCode } from "~/libs/enums/enums.js";
import { HTTPError } from "~/libs/modules/http/http.js";

const checkIsExpiredTokenError = (error: unknown): boolean => {
	return (
		error instanceof HTTPError &&
		error.code === TokenErrorCode.TOKEN_HAS_EXPIRED
	);
};

export { checkIsExpiredTokenError };
