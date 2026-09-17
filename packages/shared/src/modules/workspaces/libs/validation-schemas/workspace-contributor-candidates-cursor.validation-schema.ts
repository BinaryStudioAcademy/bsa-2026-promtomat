import { z } from "zod";

import { WorkspaceValidationMessage } from "../enums/enums.js";

const workspaceContributorCandidatesCursor = z.strictObject({
	id: z
		.number({
			error: WorkspaceValidationMessage.CURSOR_ID_INVALID,
		})
		.int({
			error: WorkspaceValidationMessage.CURSOR_ID_INVALID,
		})
		.positive({
			error: WorkspaceValidationMessage.CURSOR_ID_INVALID,
		}),
	nickname: z.string().nonempty({
		error: WorkspaceValidationMessage.CURSOR_NICKNAME_REQUIRED,
	}),
});

export { workspaceContributorCandidatesCursor };
