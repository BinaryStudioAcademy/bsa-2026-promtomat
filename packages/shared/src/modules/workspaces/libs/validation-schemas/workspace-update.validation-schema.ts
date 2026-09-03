import { z } from "zod";

import { WorkspaceValidationMessage } from "../enums/enums.js";
import { workspaceNameField } from "./name-field.validation-schema.js";
import { stackTagsField } from "./stack-tags-field.validation-schema.js";

const workspaceUpdate = z
	.strictObject({
		name: workspaceNameField.optional(),
		stackTags: stackTagsField.optional(),
	})
	.refine(
		(value) => value.name !== undefined || value.stackTags !== undefined,
		{
			error: WorkspaceValidationMessage.UPDATE_REQUIRES_FIELD,
		},
	);

export { workspaceUpdate };
