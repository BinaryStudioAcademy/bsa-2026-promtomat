import { WorkspaceTargets } from "~/modules/workspaces/workspaces.js";

const WORKSPACE_DATASET_TARGET_OPTIONS = [
	WorkspaceTargets.SMALL,
	WorkspaceTargets.MEDIUM,
	WorkspaceTargets.LARGE,
	WorkspaceTargets.EXTRA_LARGE,
] as const;

export { WORKSPACE_DATASET_TARGET_OPTIONS };
