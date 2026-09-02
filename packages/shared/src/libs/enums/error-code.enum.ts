import { AuthErrorCode } from "../../modules/auth/auth.js";

const ServerErrorCode = {
	FORBIDDEN: "FORBIDDEN",
	INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
	UNAUTHENTICATED: "UNAUTHENTICATED",
	VALIDATION_FAILED: "VALIDATION_FAILED",
} as const;

const ErrorCode = {
	...ServerErrorCode,
	...AuthErrorCode,
} as const;

export { ErrorCode };
