import { z } from "zod";

import { PromptValidationMessage } from "../enums/enums.js";

const promptIdParameter = z.object({
	id: z.coerce
		.number(PromptValidationMessage.INVALID_ID)
		.int(PromptValidationMessage.INVALID_ID)
		.positive(PromptValidationMessage.INVALID_ID),
});

export { promptIdParameter };
