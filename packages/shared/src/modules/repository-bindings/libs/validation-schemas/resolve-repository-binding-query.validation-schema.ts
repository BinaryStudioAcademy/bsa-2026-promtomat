import { z } from "zod";

import {
	RepositoryBindingValidationMessage,
	RepositoryBindingValidationRule,
} from "../enums/enums.js";

const resolveRepositoryBindingQuery = z.strictObject({
	remoteUrl: z
		.string()
		.trim()
		.min(
			RepositoryBindingValidationRule.REMOTE_URL_MINIMUM_LENGTH,
			RepositoryBindingValidationMessage.REMOTE_URL_REQUIRED,
		),
});

export { resolveRepositoryBindingQuery };
