const checkAreStackTagsEqual = (
	stackTags: string[],
	otherStackTags: string[],
): boolean => {
	if (stackTags.length !== otherStackTags.length) {
		return false;
	}

	return stackTags.every((stackTag) => otherStackTags.includes(stackTag));
};

export { checkAreStackTagsEqual };
