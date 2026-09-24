import { z } from "zod";

import { type Resolution } from "../types/types.js";
import { ambiguousResolution } from "./ambiguous-resolution.validation-schema.js";
import { resolvedResolution } from "./resolved-resolution.validation-schema.js";
import { unresolvedResolution } from "./unresolved-resolution.validation-schema.js";

const resolution: z.ZodType<Resolution> = z.discriminatedUnion("status", [
	ambiguousResolution,
	resolvedResolution,
	unresolvedResolution,
]);

export { resolution };
