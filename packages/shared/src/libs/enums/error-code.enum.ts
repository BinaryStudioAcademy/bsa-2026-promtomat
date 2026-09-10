import { AuthErrorCode } from "../../modules/auth/auth.js";
import { ComposedPromptsErrorCode } from "../../modules/composed-prompts/composed-prompts.js";
import { WorkspacesErrorCode } from "../../modules/workspaces/workspaces.js";
import { ServerErrorCode } from "./server-error-code.enum.js";

const ErrorCode = {
	...ServerErrorCode,
	...AuthErrorCode,
	...ComposedPromptsErrorCode,
	...WorkspacesErrorCode,
} as const;

export { ErrorCode };
