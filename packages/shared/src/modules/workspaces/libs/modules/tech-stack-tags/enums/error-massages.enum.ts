import { MAX_TAGS_COUNT } from "../constants/tags-limits.constant.js";

const TagsErrorMessages = {
	DUPLICATE_TAGS_ERROR_MESSAGE: "Duplicate tech stack tags are not allowed",
	INVALID_TAG_ERROR_MESSAGE: "Invalid tech stack tag",
	MAX_TAGS_ERROR_MESSAGE: `You can add up to ${String(MAX_TAGS_COUNT)} tags`,
} as const;

export { TagsErrorMessages };
