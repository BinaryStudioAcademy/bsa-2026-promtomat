const RepositoryBindingsErrorMessage = {
	NO_REMOTE_CONFIGURED: "This checkout has no git remote configured.",
	REPOSITORY_BINDING_ALREADY_EXISTS:
		"This repository is already bound to this workspace",
	REPOSITORY_BINDING_NOT_FOUND: "Repository binding not found",
	UNRECOGNIZED_REPOSITORY_FORMAT:
		"This remote URL could not be recognized as a repository identity.",
} as const;

export { RepositoryBindingsErrorMessage };
