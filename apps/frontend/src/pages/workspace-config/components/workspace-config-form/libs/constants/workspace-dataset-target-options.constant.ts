import { WorkspaceTarget } from "~/modules/workspaces/workspaces.js";

const WORKSPACE_DATASET_TARGET_OPTIONS = Object.values(
	WorkspaceTarget,
).toSorted((first, second) => first - second);

export { WORKSPACE_DATASET_TARGET_OPTIONS };
