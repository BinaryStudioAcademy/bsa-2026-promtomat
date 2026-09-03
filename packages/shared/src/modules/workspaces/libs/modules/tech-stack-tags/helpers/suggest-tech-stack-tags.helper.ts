import Fuse from "fuse.js";

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

const SLICE_START_INDEX = 0;
const SUGGESTION_LIMIT = 10;
const MIN_INPUT_LENGTH = 2;

const getTechStackTagSuggestions = (input: string): string[] => {
	if (!input || typeof input !== "string" || !input.trim()) {
		return [];
	}

	const normalizedName = normalizeTagName(input);

	const exactMatch = Object.values(TECH_STACK_DICTIONARY).find(
		(tag) => normalizeTagName(tag) === normalizedName,
	);

	if (exactMatch) {
		return [exactMatch];
	}

	if (normalizedName.length < MIN_INPUT_LENGTH) {
		const prefixMatches = Object.values(TECH_STACK_DICTIONARY)
			.filter((tag) => normalizeTagName(tag).startsWith(normalizedName))
			.slice(SLICE_START_INDEX, SUGGESTION_LIMIT);

		return prefixMatches;
	}

	const fuzzyMatches = fuseInstance
		.search(input, { limit: SUGGESTION_LIMIT })
		.map((result) => result.item);

	return fuzzyMatches;
};

export { getTechStackTagSuggestions };
