const WorkspaceResolutionStatus = {
	REMOTE_AMBIGUOUS: "remote-ambiguous",
	REMOTE_NONE: "remote-none",
	RESOLVED: "resolved",
	WORKSPACE_AMBIGUOUS: "workspace-ambiguous",
	WORKSPACE_UNRESOLVED: "workspace-unresolved",
} as const;

export { WorkspaceResolutionStatus };
