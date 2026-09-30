import { z } from "zod";

import { WorkspaceTarget } from "../enums/workspace-target.enum.js";
import { datasetTargetField } from "./dataset-target-field.validation-schema.js";
import { workspaceDescriptionField } from "./description-field.validation-schema.js";
import { workspaceNameField } from "./name-field.validation-schema.js";
import { stackTagsField } from "./stack-tags-field.validation-schema.js";
import { visibilityField } from "./visibility-field.validation-schema.js";

const workspaceCreation = z.object({
	datasetTarget: datasetTargetField.default(WorkspaceTarget.MEDIUM),
	description: workspaceDescriptionField.optional().default(""),
	name: workspaceNameField,
	stackTags: stackTagsField.optional().default([]),
	visibility: visibilityField,
});

export { workspaceCreation };
