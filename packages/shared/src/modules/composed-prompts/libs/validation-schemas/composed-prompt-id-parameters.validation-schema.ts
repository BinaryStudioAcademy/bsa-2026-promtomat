import { z } from "zod";

import { ComposedPromptValidationMessage } from "../enums/enums.js";

const composedPromptIdParameters = z.object({
	id: z.coerce
		.number(ComposedPromptValidationMessage.INVALID_ID)
		.int(ComposedPromptValidationMessage.INVALID_ID)
		.positive(ComposedPromptValidationMessage.INVALID_ID),
});

export { composedPromptIdParameters };
