import { type ComposedPromptStructuredGenerationOutput } from "~/libs/modules/generator/generator.js";
import { type ValueOf } from "~/libs/types/types.js";

import { type FallbackReason } from "../enums/enums.js";

type GenerationOutcome =
	| { output: ComposedPromptStructuredGenerationOutput; reason: null }
	| { output: null; reason: ValueOf<typeof FallbackReason> };

export { type GenerationOutcome };
