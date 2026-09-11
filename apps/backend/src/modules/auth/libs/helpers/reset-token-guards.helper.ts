import { TokenErrorMessage } from "~/libs/modules/token/token.js";

const checkIsExpiredTokenError = (error: unknown): boolean => {
	return (
		error instanceof Error &&
		error.message === TokenErrorMessage.TOKEN_HAS_EXPIRED
	);
};

export { checkIsExpiredTokenError };
