const WorkspacesErrorMessage = {
	LAST_WORKSPACE_DELETION_NOT_ALLOWED:
		"You cannot delete your last workspace. Create another workspace first.",
	WORKSPACE_ALREADY_EXISTS: "Workspace with this name already exists",
	WORKSPACE_NOT_FOUND: "Workspace not found",
} as const;

export { WorkspacesErrorMessage };
