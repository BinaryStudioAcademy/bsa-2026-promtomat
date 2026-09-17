const WorkspacesApiPath = {
	$WORKSPACE_ID: "/:workspaceId",
	CONTRIBUTOR_CANDIDATES: "/contributor-candidates",
	CONTRIBUTORS: "/contributors",
	CONTRIBUTORS_USER_ID: "/contributors/:userId",
	ROOT: "/",
} as const;

export { WorkspacesApiPath };
