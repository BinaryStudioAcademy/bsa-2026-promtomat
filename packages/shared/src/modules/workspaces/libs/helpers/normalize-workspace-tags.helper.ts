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

	const validTags: string[] = [];

	const droppedTags: string[] = [];

	for (const tag of originalTags) {
		if (checkIsValidTechStackTag(tag)) {
			validTags.push(tag);
		} else {
			droppedTags.push(tag);
		}
	}

	const normalizedTags = [...new Set(normalizeTechStackTags(validTags))];

	return { droppedTags, normalizedTags };
};

export { normalizeWorkspaceTags };
