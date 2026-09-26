import { z } from "zod";

import { RepositoryBindingValidationMessage } from "../enums/enums.js";

const repositoryBindingRouteParameters = z.object({
	repositoryBindingId: z.coerce
		.number({
			error: RepositoryBindingValidationMessage.REPOSITORY_BINDING_ID_INVALID,
		})
		.int({
			error: RepositoryBindingValidationMessage.REPOSITORY_BINDING_ID_INVALID,
		})
		.positive({
			error: RepositoryBindingValidationMessage.REPOSITORY_BINDING_ID_INVALID,
		}),
});

export { repositoryBindingRouteParameters };
