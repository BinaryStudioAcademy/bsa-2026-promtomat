import { z } from "zod";

import {
	checkIsValidTechStackTag,
	normalizeTechStackTag,
} from "../../../workspaces/libs/modules/tech-stack-tags/tech-stack-tags.js";
import {
	RepositoryBindingValidationMessage,
	RepositoryBindingValidationRule,
} from "../enums/enums.js";

const repositoryBindingCreation = z.strictObject({
	remoteUrl: z
		.string()
		.trim()
		.min(
			RepositoryBindingValidationRule.REMOTE_URL_MINIMUM_LENGTH,
			RepositoryBindingValidationMessage.REMOTE_URL_REQUIRED,
		),
	stackTags: z
		.array(z.string())
		.optional()
		.transform((tags) => {
			const validTags = (tags ?? [])
				.filter(checkIsValidTechStackTag)
				.map((tag) => normalizeTechStackTag(tag));

			return [...new Set(validTags)];
		}),
	workspaceId: z.number().int().positive(),
});

export { repositoryBindingCreation };
