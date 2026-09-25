import { z } from "zod";

import { WorkspaceValidationMessage } from "../enums/enums.js";
import { workspaceDescriptionField } from "./description-field.validation-schema.js";
import { workspaceNameField } from "./name-field.validation-schema.js";
import { stackTagsField } from "./stack-tags-field.validation-schema.js";

const workspaceUpdate = z
	.strictObject({
		description: workspaceDescriptionField.exactOptional(),
		name: workspaceNameField.exactOptional(),
		stackTags: stackTagsField.exactOptional(),
	})
	.refine(
		(value) =>
			value.description !== undefined ||
			value.name !== undefined ||
			value.stackTags !== undefined,
		{
			error: WorkspaceValidationMessage.UPDATE_REQUIRES_FIELD,
		},
	);

export { workspaceUpdate };
