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
	});

export { workspaceDescriptionField };
