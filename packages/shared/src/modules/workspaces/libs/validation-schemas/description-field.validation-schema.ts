import { z } from "zod";

import {
	WorkspaceValidationMessage,
	WorkspaceValidationRule,
} from "../enums/enums.js";

const workspaceDescriptionField = z
	.string()
	.max(WorkspaceValidationRule.DESCRIPTION_MAXIMUM_LENGTH, {
		error: WorkspaceValidationMessage.DESCRIPTION_TOO_LONG,
	})
	.refine((value) => value === value.trim(), {
		error:
			WorkspaceValidationMessage.DESCRIPTION_HAS_LEADING_OR_TRAILING_SPACES,
	});

export { workspaceDescriptionField };
