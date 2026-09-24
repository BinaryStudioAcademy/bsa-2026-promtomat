import { z } from "zod";

import {
	MAX_TAGS_COUNT,
	TagsErrorMessage,
	techStackTag,
} from "../modules/tech-stack-tags/tech-stack-tags.js";

const stackTagsField = z
	.array(techStackTag)
	.refine((tags) => new Set(tags).size === tags.length, {
		message: TagsErrorMessage.DUPLICATE_TAGS,
	})
	.max(MAX_TAGS_COUNT, { message: TagsErrorMessage.MAX_TAGS });

export { stackTagsField };
