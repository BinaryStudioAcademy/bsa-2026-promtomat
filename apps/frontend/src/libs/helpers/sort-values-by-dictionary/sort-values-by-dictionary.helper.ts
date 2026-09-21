const sortValuesByDictionary = (
	values: string[],
	valuesDictionary: string[],
): string[] =>
	values.toSorted(
		(value, otherValue) =>
			valuesDictionary.indexOf(value) - valuesDictionary.indexOf(otherValue),
	);

export { sortValuesByDictionary };
