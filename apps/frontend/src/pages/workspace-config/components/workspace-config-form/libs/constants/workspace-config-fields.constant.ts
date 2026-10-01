import { type FieldPath } from "react-hook-form";

import { type WorkspaceUpdateRequestDto } from "~/modules/workspaces/libs/types/types.js";

const WORKSPACE_CONFIG_FIELDS = [
	"datasetTarget",
	"description",
	"name",
	"stackTags",
] satisfies FieldPath<WorkspaceUpdateRequestDto>[];

export { WORKSPACE_CONFIG_FIELDS };
