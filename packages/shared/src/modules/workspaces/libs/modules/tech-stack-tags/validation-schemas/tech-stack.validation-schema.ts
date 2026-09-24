import { z } from "zod";

import { TagsErrorMessage } from "../enums/enums.js";
import {
	checkIsValidTechStackTag,
	normalizeTechStackTag,
} from "../helpers/helpers.js";

const techStackTag = z
	.string()
	.refine(
		(tag) => {
			return checkIsValidTechStackTag(tag);
		},
		{ message: TagsErrorMessage.INVALID_TAG },
	)
	.transform((tag) => {
		return normalizeTechStackTag(tag);
	});

export { techStackTag };
