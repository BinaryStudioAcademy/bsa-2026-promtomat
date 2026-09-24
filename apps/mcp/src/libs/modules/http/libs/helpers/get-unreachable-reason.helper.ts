import { FetchErrorName, UnreachableReason } from "../enums/enums.js";

const getErrorCode = (error: unknown): string | undefined =>
	typeof error === "object" &&
	error !== null &&
	"code" in error &&
	typeof error.code === "string"
		? error.code
		: undefined;

const getUnreachableReason = (error: unknown): string => {
	if (error instanceof Error && error.name === FetchErrorName.TIMEOUT) {
		return UnreachableReason.TIMEOUT;
	}

	const cause = error instanceof Error ? error.cause : undefined;

	return (
		getErrorCode(cause) ??
		getErrorCode(error) ??
		UnreachableReason.NETWORK_FAILURE
	);
};

export { getUnreachableReason };
