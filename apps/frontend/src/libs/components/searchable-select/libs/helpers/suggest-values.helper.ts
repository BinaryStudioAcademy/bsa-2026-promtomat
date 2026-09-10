import Fuse from "fuse.js";

import { FUZZY_MATCH_LIMIT } from "../constants/constants.js";

const buildFuseInstance = (valuesDictionary: string[]): Fuse<string> =>
	new Fuse(valuesDictionary, {
		distance: 100,
		ignoreLocation: true,
		includeMatches: true,
		includeScore: true,
		minMatchCharLength: 2,
		threshold: 0.3,
	});

const normalizeString = (input: string): string => input.trim().toLowerCase();

const getValuesSuggestions = (
	input: string,
	valuesDictionary: string[],
): string[] => {
	if (!input || typeof input !== "string" || !input.trim()) {
		return Object.values(valuesDictionary);
	}

	const normalizedName = normalizeString(input);

	const exactMatch = valuesDictionary.find(
		(value) => normalizeString(value) === normalizedName,
	);

	const prefixMatches = valuesDictionary.filter(
		(value) =>
			value !== exactMatch && normalizeString(value).startsWith(normalizedName),
	);

	const fuseInstance = buildFuseInstance(valuesDictionary);

	const fuzzyMatches = fuseInstance
		.search(input, { limit: FUZZY_MATCH_LIMIT })
		.map((result) => result.item)
		.filter((value) => value !== exactMatch && !prefixMatches.includes(value));

	return [
		...(exactMatch ? [exactMatch] : []),
		...prefixMatches,
		...fuzzyMatches,
	];
};

export { getValuesSuggestions };
