import { z } from "zod";

import { PromptValidationMessage } from "../enums/prompt-validation-message.enum.js";

const promptRouteParameters = z.object({
	promptId: z.coerce
		.number({
			error: PromptValidationMessage.ID_INVALID,
		})
		.int({
			error: PromptValidationMessage.ID_INVALID,
		})
		.positive({
			error: PromptValidationMessage.ID_INVALID,
		}),
});

export { promptRouteParameters };
