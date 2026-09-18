import { z } from "zod";

import { UserValidationMessage } from "../../../users/users.js";
import { workspaceRouteParameters } from "./workspace-route-parameters.validation-schema.js";

const workspaceContributorRouteParameters = workspaceRouteParameters.extend({
	userId: z.coerce
		.number({
			error: UserValidationMessage.ID_INVALID,
		})
		.int({
			error: UserValidationMessage.ID_INVALID,
		})
		.positive({
			error: UserValidationMessage.ID_INVALID,
		}),
});

export { workspaceContributorRouteParameters };
