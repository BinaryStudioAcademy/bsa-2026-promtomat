import { SdkErrorName } from "../enums/enums.js";

const checkIsTimeoutError = (error: unknown): boolean =>
	error instanceof Error && error.name === SdkErrorName.TIMEOUT;

export { checkIsTimeoutError };
