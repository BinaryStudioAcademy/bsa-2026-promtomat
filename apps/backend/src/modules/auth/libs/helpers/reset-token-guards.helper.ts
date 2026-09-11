import { TokenErrorMessage } from "~/libs/modules/token/token.js";

const MILLISECONDS_IN_SECOND = 1000;

const checkIsExpiredTokenError = (error: unknown): boolean => {
	return (
		error instanceof Error &&
		error.message === TokenErrorMessage.TOKEN_HAS_EXPIRED
	);
};

const checkIsTokenSuperseded = (
	issuedAt: number | undefined,
	passwordChangedAt: null | string,
): boolean => {
	if (passwordChangedAt === null || issuedAt === undefined) {
		return false;
	}

	const changedAtSeconds = Math.floor(
		new Date(passwordChangedAt).getTime() / MILLISECONDS_IN_SECOND,
	);

	return issuedAt < changedAtSeconds;
};

export { checkIsExpiredTokenError, checkIsTokenSuperseded };
