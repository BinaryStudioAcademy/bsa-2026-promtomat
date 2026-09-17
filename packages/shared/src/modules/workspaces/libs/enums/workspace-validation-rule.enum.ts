const WorkspaceValidationRule = {
	NAME_MAXIMUM_LENGTH: 50,
	NAME_MINIMUM_LENGTH: 3,
	NAME_REGEX: /^(?:[^\p{L}]|[A-Za-z])*$/u,
} as const;

export { WorkspaceValidationRule };
