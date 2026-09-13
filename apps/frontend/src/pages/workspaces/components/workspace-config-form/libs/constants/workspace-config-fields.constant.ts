import { type FieldPath } from "react-hook-form";

import { type WorkspaceDto } from "~/modules/workspaces/libs/types/types.js";

const WORKSPACE_CONFIG_FIELDS = [
	"name",
	"stackTags",
] satisfies FieldPath<WorkspaceDto>[];

export { WORKSPACE_CONFIG_FIELDS };
