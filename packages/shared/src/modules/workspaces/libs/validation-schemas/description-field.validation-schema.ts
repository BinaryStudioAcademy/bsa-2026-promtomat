import { z } from "zod";

import {
	WorkspaceValidationMessage,
	WorkspaceValidationRule,
} from "../enums/enums.js";

const workspaceDescriptionField = z
	.string()
	.trim()
	.max(WorkspaceValidationRule.DESCRIPTION_MAXIMUM_LENGTH, {
		error: WorkspaceValidationMessage.DESCRIPTION_TOO_LONG,
	})
	.refine(
		(value) =>
			!WorkspaceValidationRule.DESCRIPTION_LINE_BREAK_REGEX.test(value),
		{
			error: WorkspaceValidationMessage.DESCRIPTION_HAS_LINE_BREAKS,
		},
	);

export { workspaceDescriptionField };
