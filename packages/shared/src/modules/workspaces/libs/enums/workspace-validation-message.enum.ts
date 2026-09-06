import { WorkspaceValidationRule } from "./workspace-validation-rule.enum.js";

const WorkspaceValidationMessage = {
	NAME_HAS_LEADING_OR_TRAILING_SPACES:
		"Name must not start or end with a space",
	NAME_TOO_LONG: `Workspace name must be at most ${String(WorkspaceValidationRule.NAME_MAXIMUM_LENGTH)} characters`,
	NAME_TOO_SHORT: `Workspace name must be at least ${String(WorkspaceValidationRule.NAME_MINIMUM_LENGTH)} characters`,
	VISIBILITY_INVALID: "Visibility is invalid",
} as const;

export { WorkspaceValidationMessage };
