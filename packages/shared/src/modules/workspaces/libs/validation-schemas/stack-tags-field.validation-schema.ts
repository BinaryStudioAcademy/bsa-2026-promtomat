import { z } from "zod";

import {
	MAX_TAGS_COUNT,
	TagsErrorMessages,
	TechStackTagSchema,
} from "../modules/tech-stack-tags/tech-stack-tags.js";

const stackTagsField = z
	.array(TechStackTagSchema)
	.refine((tags) => new Set(tags).size === tags.length, {
		message: TagsErrorMessages.DUPLICATE_TAGS_ERROR_MESSAGE,
	})
	.max(MAX_TAGS_COUNT, { message: TagsErrorMessages.MAX_TAGS_ERROR_MESSAGE });

export { stackTagsField };
