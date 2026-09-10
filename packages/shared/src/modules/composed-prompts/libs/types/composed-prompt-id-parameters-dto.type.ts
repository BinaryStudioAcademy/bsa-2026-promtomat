import { type z } from "zod";

import { composedPromptIdParameters } from "../validation-schemas/composed-prompt-id-parameters.validation-schema.js";

type ComposedPromptIdParametersDto = z.infer<typeof composedPromptIdParameters>;

export { type ComposedPromptIdParametersDto };
