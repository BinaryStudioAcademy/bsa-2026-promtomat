import { z } from "zod";

import {
	checkIsValidTechStackTag,
	normalizeTechStackTag,
} from "../helpers/helpers.js";

const INVALID_TAG_ERROR_MESSAGE = "Invalid tech stack tag";

const TechStackTagSchema = z
	.string()
	.refine(
		(tag) => {
			return checkIsValidTechStackTag(tag);
		},
		{ message: INVALID_TAG_ERROR_MESSAGE },
	)
	.transform((tag) => {
		return normalizeTechStackTag(tag);
	});

export { TechStackTagSchema };
