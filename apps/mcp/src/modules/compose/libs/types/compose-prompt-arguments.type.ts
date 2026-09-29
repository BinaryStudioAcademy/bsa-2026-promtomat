import { type z } from "zod";

import { type composePromptInputSchema } from "../validation-schemas/validation-schemas.js";

type ComposePromptArguments = z.infer<
	z.ZodObject<typeof composePromptInputSchema>
>;

export { type ComposePromptArguments };
