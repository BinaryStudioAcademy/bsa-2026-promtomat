import { AuthErrorCode } from "../../modules/auth/auth.js";
import { ComposedPromptsErrorCode } from "../../modules/composed-prompts/composed-prompts.js";
import { PromptsErrorCode } from "../../modules/prompts/prompts.js";
import { WorkspacesErrorCode } from "../../modules/workspaces/workspaces.js";
import { ServerErrorCode } from "./server-error-code.enum.js";

const ErrorCode = {
	...ServerErrorCode,
	...AuthErrorCode,
	...ComposedPromptsErrorCode,
	...WorkspacesErrorCode,
	...PromptsErrorCode,
} as const;

export { ErrorCode };
