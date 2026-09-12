import { z } from "zod";

import { workspaceNameField } from "./name-field.validation-schema.js";
import { stackTagsField } from "./stack-tags-field.validation-schema.js";
import { visibilityField } from "./visibility-field.validation-schema.js";

const workspaceCreation = z.object({
	name: workspaceNameField,
	stackTags: stackTagsField.optional().default([]),
	visibility: visibilityField,
});

export { workspaceCreation };
