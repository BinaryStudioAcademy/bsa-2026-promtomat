import { WorkspaceListScope } from "~/modules/workspaces/workspaces.js";

const WORKSPACE_LIST_SCOPE_OPTIONS = [
	{ label: "All", value: WorkspaceListScope.ALL },
	{ label: "Created by you", value: WorkspaceListScope.OWNED },
	{ label: "Shared with you", value: WorkspaceListScope.SHARED },
] as const;

export { WORKSPACE_LIST_SCOPE_OPTIONS };
