import { z } from "zod";

import { PromptValidationMessage } from "../enums/enums.js";

const promptWorkspaceQuery = z.object({
	workspaceId: z.coerce
		.number(PromptValidationMessage.INVALID_CONTEXT)
		.int()
		.positive(),
});

export { promptWorkspaceQuery };
