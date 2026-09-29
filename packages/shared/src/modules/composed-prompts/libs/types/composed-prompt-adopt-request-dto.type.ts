import { type z } from "zod";

import { composedPromptAdopt } from "../validation-schemas/composed-prompt-adopt.validation-schema.js";

type ComposedPromptAdoptRequestDto = z.infer<typeof composedPromptAdopt>;

export { type ComposedPromptAdoptRequestDto };
