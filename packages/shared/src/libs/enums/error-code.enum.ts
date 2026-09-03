import { AuthErrorCode } from "../../modules/auth/auth.js";
import { ServerErrorCode } from "./server-error-code.enum.js";

const ErrorCode = {
	...ServerErrorCode,
	...AuthErrorCode,
} as const;

export { ErrorCode };
