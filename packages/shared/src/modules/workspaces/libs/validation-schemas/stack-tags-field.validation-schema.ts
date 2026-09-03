import { z } from "zod";

import {
	MAX_TAGS_COUNT,
	TAGS_ERROR_MESSAGES,
	TechStackTagSchema,
} from "../modules/tech-stack-tags/tech-stack-tags.js";

const stackTagsField = z
	.array(TechStackTagSchema)
	.max(MAX_TAGS_COUNT, { message: TAGS_ERROR_MESSAGES.MAX_TAGS_ERROR_MESSAGE })
	.optional()
	.default([]);

export { stackTagsField };
