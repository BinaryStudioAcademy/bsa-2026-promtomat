import { z } from "zod";

import { type RepositoryBindingResolution } from "../types/types.js";
import { ambiguousResolution } from "./ambiguous-resolution.validation-schema.js";
import { resolvedResolution } from "./resolved-resolution.validation-schema.js";
import { unresolvedResolution } from "./unresolved-resolution.validation-schema.js";

const resolveRepositoryBinding: z.ZodType<RepositoryBindingResolution> =
	z.discriminatedUnion("status", [
		ambiguousResolution,
		resolvedResolution,
		unresolvedResolution,
	]);

export { resolveRepositoryBinding };
