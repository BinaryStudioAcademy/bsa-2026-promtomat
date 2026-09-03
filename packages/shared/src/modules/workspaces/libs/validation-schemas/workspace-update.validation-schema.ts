import { z } from "zod";

import { WorkspaceValidationMessage } from "../enums/enums.js";
import { nameField } from "./name-field.validation-schema.js";
import { stackTagsField } from "./stack-tags-field.validation-schema.js";

const workspaceUpdate = z
	.strictObject({
		name: nameField.optional(),
		stackTags: stackTagsField.optional(),
	})
	.refine(
		(value) => value.name !== undefined || value.stackTags !== undefined,
		{
			error: WorkspaceValidationMessage.UPDATE_REQUIRES_FIELD,
		},
	);

export { workspaceUpdate };
