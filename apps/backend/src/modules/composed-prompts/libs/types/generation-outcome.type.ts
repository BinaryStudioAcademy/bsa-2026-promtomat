import { type ValueOf } from "~/libs/types/types.js";

import { type FallbackReason } from "../enums/enums.js";
import { type GeneratedComposition } from "./generated-composition.type.js";

type GenerationOutcome =
	| { output: GeneratedComposition; reason: null }
	| { output: null; reason: ValueOf<typeof FallbackReason> };

export { type GenerationOutcome };
