import { z } from "zod";

import { WorkspaceValidationMessage } from "../enums/enums.js";

const workspaceRouteParameters = z.object({
	id: z.coerce
		.number({
			error: WorkspaceValidationMessage.ID_INVALID,
		})
		.int({
			error: WorkspaceValidationMessage.ID_INVALID,
		})
		.positive({
			error: WorkspaceValidationMessage.ID_INVALID,
		}),
});

export { workspaceRouteParameters };
