import {
	checkIsValidTechStackTag,
	normalizeTechStackTags,
} from "../modules/tech-stack-tags/tech-stack-tags.js";

type NormalizeWorkspaceTagsResult = {
	droppedTags: string[];
	normalizedTags: string[];
};

const normalizeWorkspaceTags = (
	originalTags: string[] = [],
): NormalizeWorkspaceTagsResult => {
	if (!Array.isArray(originalTags)) {
		return {
			droppedTags: [],
			normalizedTags: [],
		};
	}

	const normalizedTags = [...new Set(normalizeTechStackTags(originalTags))];
	const droppedTags = originalTags.filter(
		(tag) => !checkIsValidTechStackTag(tag),
	);

	return { droppedTags, normalizedTags };
};

export { normalizeWorkspaceTags };
