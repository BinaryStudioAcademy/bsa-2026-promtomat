const WorkspacesApiPath = {
	ROOT: "/",
	WORKSPACE_MEMBERSHIP: "/:id/memberships/:userId",
	WORKSPACE_MEMBERSHIPS: "/:id/memberships",
} as const;

export { WorkspacesApiPath };
