import { WorkspaceValidationRule } from "./workspace-validation-rule.enum.js";

const WorkspaceValidationMessage = {
	DESCRIPTION_HAS_LEADING_OR_TRAILING_SPACES:
		"Description must not start or end with a space",
	DESCRIPTION_HAS_LINE_BREAKS: "Description must be a single line",
	DESCRIPTION_TOO_LONG: `Workspace description must be at most ${String(WorkspaceValidationRule.DESCRIPTION_MAXIMUM_LENGTH)} characters`,
	EMAIL_OR_NICKNAME_REQUIRED: "Email or nickname is required",
	EMAIL_OR_NICKNAME_TOO_LONG: `Email or nickname must be at most ${String(WorkspaceValidationRule.EMAIL_OR_NICKNAME_MAXIMUM_LENGTH)} characters`,
	ID_INVALID: "Workspace ID must be a positive integer",
	NAME_HAS_LEADING_OR_TRAILING_SPACES:
		"Name must not start or end with a space",
	NAME_INVALID:
		"Workspace name must include at least one Latin letter, and cannot contain other alphabets or emoji",
	NAME_TOO_LONG: `Workspace name must be at most ${String(WorkspaceValidationRule.NAME_MAXIMUM_LENGTH)} characters`,
	NAME_TOO_SHORT: `Workspace name must be at least ${String(WorkspaceValidationRule.NAME_MINIMUM_LENGTH)} characters`,
	UPDATE_REQUIRES_FIELD: "At least one field must be provided",
	VISIBILITY_INVALID: "Visibility is invalid",
} as const;

export { WorkspaceValidationMessage };
