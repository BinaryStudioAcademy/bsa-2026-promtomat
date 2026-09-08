const WorkspacesErrorMessage = {
	WORKSPACE_ACCESS_DENIED: "Workspace not found",
	WORKSPACE_ACTION_FORBIDDEN:
		"You do not have permission to perform this action",
	WORKSPACE_ALREADY_EXISTS: "Workspace with this name already exists",
} as const;

export { WorkspacesErrorMessage };
