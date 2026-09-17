const MAX_LENGTH = 15;

const LabelConstraint = {
	MAX_LENGTH,
	NAME_PATTERN: new RegExp(`^[a-z0-9]{1,${MAX_LENGTH.toString()}}$`),
} as const;

export { LabelConstraint };
