import { AuthErrorCode } from "../../modules/auth/auth.js";
import { PromptsErrorCode } from "../../modules/prompts/prompts.js";
import { WorkspacesErrorCode } from "../../modules/workspaces/workspaces.js";
import { ServerErrorCode } from "./server-error-code.enum.js";

const ErrorCode = {
	...ServerErrorCode,
	...AuthErrorCode,
	...PromptsErrorCode,
	...WorkspacesErrorCode,
} as const;

export { ErrorCode };
