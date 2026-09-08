import Fuse from "fuse.js";

import {
	FIRST_ELEMENT_INDEX,
	SUGGESTION_LIMIT,
} from "../constants/constants.js";
import { TECH_STACK_DICTIONARY } from "../enums/dictionary.enum.js";
import { normalizeTagName } from "./normalize-tech-stack-tags.helper.js";

const fuseInstance = new Fuse(Object.values(TECH_STACK_DICTIONARY), {
	distance: 100,
	ignoreLocation: true,
	includeMatches: true,
	includeScore: true,
	minMatchCharLength: 2,
	threshold: 0.3,
});

const getTechStackTagSuggestions = (input: string): string[] => {
	if (!input || typeof input !== "string" || !input.trim()) {
		return Object.values(TECH_STACK_DICTIONARY);
	}

	const normalizedName = normalizeTagName(input);
	const allTags = Object.values(TECH_STACK_DICTIONARY);

	const exactMatch = allTags.find(
		(tag) => normalizeTagName(tag) === normalizedName,
	);

	const prefixMatches = allTags.filter(
		(tag) =>
			tag !== exactMatch && normalizeTagName(tag).startsWith(normalizedName),
	);

	const fuzzyMatches = fuseInstance
		.search(input, { limit: SUGGESTION_LIMIT })
		.map((result) => result.item)
		.filter((tag) => tag !== exactMatch && !prefixMatches.includes(tag));

	const orderedMatches = [
		...(exactMatch ? [exactMatch] : []),
		...prefixMatches,
		...fuzzyMatches,
	];

	return orderedMatches.slice(FIRST_ELEMENT_INDEX, SUGGESTION_LIMIT);
};

export { getTechStackTagSuggestions };
