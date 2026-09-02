import { VARIANT_TO_CANONICAL } from "../enums/enums.js";

const normalizeTechStackTag = (tag: string): string => {
	const normalizedTag = normalizeTagName(tag);
	const canonicalTag = VARIANT_TO_CANONICAL[normalizedTag];

	return canonicalTag ?? tag;
};

const normalizeTechStackTags = (tags: string[]): string[] => {
	const normalizedTags = tags.map((tag) => normalizeTechStackTag(tag));

	return normalizedTags;
};

const normalizeTagName = (tag: string): string => {
	return tag.trim().toLowerCase();
};

const isValidTechStackTag = (tag: string): boolean => {
	return Object.hasOwn(VARIANT_TO_CANONICAL, normalizeTagName(tag));
};

export {
	isValidTechStackTag,
	normalizeTagName,
	normalizeTechStackTag,
	normalizeTechStackTags,
};
