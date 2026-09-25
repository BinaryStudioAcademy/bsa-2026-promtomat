import { z } from "zod";

import { workspaceDescriptionField } from "./description-field.validation-schema.js";
import { workspaceNameField } from "./name-field.validation-schema.js";
import { stackTagsField } from "./stack-tags-field.validation-schema.js";
import { visibilityField } from "./visibility-field.validation-schema.js";

const workspaceCreation = z.object({
	description: workspaceDescriptionField.optional().default(""),
	name: workspaceNameField,
	stackTags: stackTagsField.optional().default([]),
	visibility: visibilityField,
});

export { workspaceCreation };
