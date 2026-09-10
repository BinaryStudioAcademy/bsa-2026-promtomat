const escapeILikePattern = (value: string): string => {
	return value.replaceAll(/[\\%_]/g, String.raw`\$&`);
};

export { escapeILikePattern };
