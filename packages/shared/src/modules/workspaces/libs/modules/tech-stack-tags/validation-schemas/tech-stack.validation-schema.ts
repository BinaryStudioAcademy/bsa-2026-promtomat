import { z } from "zod";

import {
	isValidTechStackTag,
	normalizeTechStackTag,
} from "../helpers/helpers.js";

const INVALID_TAG_ERROR_MESSAGE = "Invalid tech stack tag";

const TechStackTagSchema = z
	.string()
	.refine(
		(tag) => {
			return isValidTechStackTag(tag);
		},
		{ message: INVALID_TAG_ERROR_MESSAGE },
	)
	.transform((tag) => {
		return normalizeTechStackTag(tag);
	});

const TechStackTagsSchema = z.array(TechStackTagSchema).optional().default([]);

export { TechStackTagSchema, TechStackTagsSchema };
