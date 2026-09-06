import { z } from "zod";

import { TAGS_ERROR_MESSAGES } from "../enums/enums.js";
import {
	checkIsValidTechStackTag,
	normalizeTechStackTag,
} from "../helpers/helpers.js";

const TechStackTagSchema = z
	.string()
	.refine(
		(tag) => {
			return checkIsValidTechStackTag(tag);
		},
		{ message: TAGS_ERROR_MESSAGES.INVALID_TAG_ERROR_MESSAGE },
	)
	.transform((tag) => {
		return normalizeTechStackTag(tag);
	});

export { TechStackTagSchema };
