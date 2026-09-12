const ContributorsErrorMessage = {
	CONTRIBUTOR_ALREADY_EXISTS: "User is already a contributor to this workspace",
	CONTRIBUTOR_NOT_FOUND: "Contributor not found in this workspace",
	WORKSPACE_OWNER_CANNOT_BE_ADDED_AS_CONTRIBUTOR:
		"Workspace owner cannot be added as a contributor",
} as const;

export { ContributorsErrorMessage };
