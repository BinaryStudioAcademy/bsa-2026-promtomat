import { TECH_STACK_DICTIONARY } from "../enums/dictionary.enum.js";
import { normalizeTagName } from "./normalize-tech-stack-tags.helper.js";

const getTechStackTagSuggestions = (input: string): string[] => {
	const normalizedName = normalizeTagName(input);

	const suggestions = Object.values(TECH_STACK_DICTIONARY).filter((tag) => {
		return normalizeTagName(tag).startsWith(normalizedName);
	});

	return suggestions;
};

export { getTechStackTagSuggestions };
