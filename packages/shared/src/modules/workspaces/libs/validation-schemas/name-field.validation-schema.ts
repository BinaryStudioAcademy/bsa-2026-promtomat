import { z } from "zod";

import {
	WorkspaceValidationMessage,
	WorkspaceValidationRule,
} from "../enums/enums.js";

const workspaceNameField = z
	.string()
	.trim()
	.min(WorkspaceValidationRule.NAME_MINIMUM_LENGTH, {
		error: WorkspaceValidationMessage.NAME_TOO_SHORT,
	})
	.max(WorkspaceValidationRule.NAME_MAXIMUM_LENGTH, {
		error: WorkspaceValidationMessage.NAME_TOO_LONG,
	})
	.regex(WorkspaceValidationRule.NAME_REGEX, {
		error: WorkspaceValidationMessage.NAME_INVALID,
	});

export { workspaceNameField };
