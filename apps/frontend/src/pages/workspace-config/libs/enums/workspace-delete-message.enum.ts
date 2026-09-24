const WorkspaceDeleteMessage = {
	DANGER_ZONE_DESCRIPTION:
		"Deleting this workspace destroys every prompt in it, logged and generated alike, and removes them from the retrieval index for every member.",
	DELETE: "Delete Workspace",
	DELETION_CANNOT_BE_UNDONE: "Deleting the workspace cannot be undone.",
	NO_PROMPTS: "This workspace has no prompts.",
	TITLE: "Delete “:workspaceName” permanently",
} as const;

export { WorkspaceDeleteMessage };
