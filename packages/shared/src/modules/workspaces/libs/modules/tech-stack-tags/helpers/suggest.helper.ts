import { TECH_STACK_DICTIONARY } from "../enums/dictionary.enum.js";
import { normalizeTagName } from "./normalize.helper.js";

const SUGGESTION_LIMIT = 5;
const MIN_INPUT_LENGTH = 1;
const UINT32_RANGE = 4_294_967_296;
const SINGLE_VALUE_LENGTH = 1;
const SINGLE_VALUE_INDEX = 0;
const FIRST_INDEX = 0;
const INDEX_STEP = 1;

const getRandomInt = (maxExclusive: number): number => {
	const maxUnbiasedValue =
		Math.floor(UINT32_RANGE / maxExclusive) * maxExclusive;
	const buffer = new Uint32Array(SINGLE_VALUE_LENGTH);

	let randomValue = maxUnbiasedValue;

	while (randomValue >= maxUnbiasedValue) {
		crypto.getRandomValues(buffer);
		randomValue = buffer[SINGLE_VALUE_INDEX] ?? maxUnbiasedValue;
	}

	return randomValue % maxExclusive;
};

const shuffleTags = (tags: string[]): string[] => {
	const shuffled = [...tags];

	for (
		let index = shuffled.length - INDEX_STEP;
		index > FIRST_INDEX;
		index -= INDEX_STEP
	) {
		const swapIndex = getRandomInt(index + INDEX_STEP);
		const currentTag = shuffled[index];
		const swapTag = shuffled[swapIndex];

		if (currentTag !== undefined && swapTag !== undefined) {
			shuffled[index] = swapTag;
			shuffled[swapIndex] = currentTag;
		}
	}

	return shuffled;
};

const getRandomTechStackTags = (): string[] => {
	const allTags = Object.values(TECH_STACK_DICTIONARY);

	return shuffleTags(allTags).slice(FIRST_INDEX, SUGGESTION_LIMIT);
};

const getTechStackTagSuggestions = (input: string): string[] => {
	if (input.length < MIN_INPUT_LENGTH) {
		return getRandomTechStackTags();
	}

	const normalizedName = normalizeTagName(input);

	const suggestions = Object.values(TECH_STACK_DICTIONARY).filter((tag) => {
		return normalizeTagName(tag).startsWith(normalizedName);
	});

	return suggestions;
};

export { getRandomTechStackTags, getTechStackTagSuggestions };
