const WorkspacesApiPath = {
	$WORKSPACE_ID: "/:workspaceId",
	$WORKSPACE_ID_CONTRIBUTOR_CANDIDATES: "/:workspaceId/contributor-candidates",
	$WORKSPACE_ID_CONTRIBUTORS: "/:workspaceId/contributors",
	$WORKSPACE_ID_CONTRIBUTORS_USER_ID: "/:workspaceId/contributors/:userId",
	ROOT: "/",
} as const;

export { WorkspacesApiPath };
