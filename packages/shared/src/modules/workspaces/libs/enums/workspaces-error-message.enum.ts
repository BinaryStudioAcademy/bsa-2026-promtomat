const WorkspacesErrorMessage = {
	LAST_WORKSPACE_DELETION_NOT_ALLOWED:
		"You cannot delete your last workspace. Create another workspace first.",
	WORKSPACE_ACTION_FORBIDDEN:
		"You do not have permission to perform this action",
	WORKSPACE_ALREADY_EXISTS: "Workspace with this name already exists",
	WORKSPACE_NOT_FOUND: "Workspace not found",
	WORKSPACE_OWNER_CANNOT_BE_REMOVED: "The workspace owner cannot be removed",
} as const;

export { WorkspacesErrorMessage };
