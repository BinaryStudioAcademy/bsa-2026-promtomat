const WorkspaceValidationRule = {
	NAME_MAXIMUM_LENGTH: 50,
	NAME_MINIMUM_LENGTH: 3,
	NAME_REGEX:
		/^(?=.*\p{Script=Latin})(?:[^\p{L}\p{Extended_Pictographic}]|\p{Script=Latin})*$/u,
} as const;

export { WorkspaceValidationRule };
