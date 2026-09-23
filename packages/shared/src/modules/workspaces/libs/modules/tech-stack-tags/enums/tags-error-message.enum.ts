import { MAX_TAGS_COUNT } from "../constants/tags-limits.constant.js";

const TagsErrorMessage = {
	DUPLICATE_TAGS: "Duplicate tech stack tags are not allowed",
	INVALID_TAG: "Invalid tech stack tag",
	MAX_TAGS: `You can add up to ${String(MAX_TAGS_COUNT)} tags`,
} as const;

export { TagsErrorMessage };
