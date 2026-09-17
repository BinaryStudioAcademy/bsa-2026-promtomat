import { AuthErrorCode } from "../../modules/auth/auth.js";
import { ComposedPromptsErrorCode } from "../../modules/composed-prompts/composed-prompts.js";
import { LabelsErrorCode } from "../../modules/labels/labels.js";
import { PromptsErrorCode } from "../../modules/prompts/prompts.js";
import { WorkspacesErrorCode } from "../../modules/workspaces/workspaces.js";
import { ServerErrorCode } from "./server-error-code.enum.js";
import { TokenErrorCode } from "./token-error-code.enum.js";

const ErrorCode = {
	...ServerErrorCode,
	...AuthErrorCode,
	...LabelsErrorCode,
	...PromptsErrorCode,
	...ComposedPromptsErrorCode,
	...WorkspacesErrorCode,
	...TokenErrorCode,
	...PromptsErrorCode,
} as const;

export { ErrorCode };
