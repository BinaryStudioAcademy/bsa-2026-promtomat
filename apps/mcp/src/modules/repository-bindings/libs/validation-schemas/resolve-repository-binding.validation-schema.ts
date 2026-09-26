import { z } from "zod";

import { type RepositoryBindingResolution } from "../types/types.js";
import { ambiguousBindingResolution } from "./ambiguous-binding-resolution.validation-schema.js";
import { resolvedBindingResolution } from "./resolved-binding-resolution.validation-schema.js";
import { unresolvedBindingResolution } from "./unresolved-binding-resolution.validation-schema.js";

const resolveRepositoryBinding: z.ZodType<RepositoryBindingResolution> =
	z.discriminatedUnion("status", [
		ambiguousBindingResolution,
		resolvedBindingResolution,
		unresolvedBindingResolution,
	]);

export { resolveRepositoryBinding };
