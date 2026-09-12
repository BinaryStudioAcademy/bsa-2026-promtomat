import { TIMEOUT_ERROR_NAME } from "../constants/constants.js";

const checkIsTimeoutError = (error: unknown): boolean =>
	error instanceof Error && error.name === TIMEOUT_ERROR_NAME;

export { checkIsTimeoutError };
