import { z } from "zod";

import {
	WorkspaceValidationMessage,
	WorkspaceValidationRule,
} from "../enums/enums.js";

const workspaceNameField = z
	.string()
	.min(WorkspaceValidationRule.NAME_MINIMUM_LENGTH, {
		error: WorkspaceValidationMessage.NAME_TOO_SHORT,
	})
	.max(WorkspaceValidationRule.NAME_MAXIMUM_LENGTH, {
		error: WorkspaceValidationMessage.NAME_TOO_LONG,
	})
	.refine((value) => value === value.trim(), {
		error: WorkspaceValidationMessage.NAME_HAS_LEADING_OR_TRAILING_SPACES,
	});

export { workspaceNameField };
