const WorkspacesApiPath = {
	$WORKSPACE_ID: "/:workspaceId",
	CONTRIBUTORS: "/contributors",
	CONTRIBUTORS_USER_ID: "/contributors/:userId",
	ROOT: "/",
} as const;

export { WorkspacesApiPath };
