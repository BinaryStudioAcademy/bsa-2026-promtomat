const sortValuesByDictionary = (
	values: string[],
	dictionaryValues: string[],
): string[] => {
	const selectedValues = new Set(values);
	return dictionaryValues.filter((entry) => selectedValues.has(entry));
};

export { sortValuesByDictionary };
