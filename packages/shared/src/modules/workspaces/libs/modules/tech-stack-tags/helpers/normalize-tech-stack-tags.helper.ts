import { VariantToCanonical } from "../enums/enums.js";

const normalizeTechStackTag = (tag: string): string => {
	const normalizedTag = normalizeTagName(tag);
	const canonicalTag = VariantToCanonical[normalizedTag];

	return canonicalTag ?? tag;
};

const normalizeTechStackTags = (tags: string[]): string[] => {
	return tags.map((tag) => normalizeTechStackTag(tag));
};

const normalizeTagName = (tag: string): string => {
	return tag.trim().toLowerCase();
};

export { normalizeTagName, normalizeTechStackTag, normalizeTechStackTags };
