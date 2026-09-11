const WorkspacesApiPath = {
	$WORKSPACE_ID_CONTRIBUTOR_CANDIDATES: "/:workspaceId/contributor-candidates",
	$WORKSPACE_ID_CONTRIBUTORS: "/:workspaceId/contributors",
	$WORKSPACE_ID_CONTRIBUTORS_USER_ID: "/:workspaceId/contributors/:userId",
	ROOT: "/",
	WORKSPACE_MEMBERSHIP: "/:id/memberships/:userId",
	WORKSPACE_MEMBERSHIPS: "/:id/memberships",
} as const;

export { WorkspacesApiPath };
