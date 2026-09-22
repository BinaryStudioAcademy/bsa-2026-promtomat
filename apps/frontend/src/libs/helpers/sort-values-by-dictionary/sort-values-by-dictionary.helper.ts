const sortValuesByDictionary = (
	values: string[],
	valuesDictionary: string[],
): string[] => {
	const selectedValues = new Set(values);
	return valuesDictionary.filter((entry) => selectedValues.has(entry));
};

export { sortValuesByDictionary };
