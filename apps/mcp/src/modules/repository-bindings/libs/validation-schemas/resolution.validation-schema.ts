import { z } from "zod";

import { type Resolution } from "../types/types.js";

const resolutionWorkspaceValidationSchema = z.object({
	id: z.number(),
	name: z.string(),
});

const ambiguousResolutionValidationSchema = z.object({
	status: z.literal("ambiguous"),
	workspaces: z.array(resolutionWorkspaceValidationSchema),
});

const resolvedResolutionValidationSchema = z.object({
	status: z.literal("resolved"),
	workspaceId: z.number(),
});

const unresolvedResolutionValidationSchema = z.object({
	status: z.literal("unresolved"),
});

const resolutionValidationSchema: z.ZodType<Resolution> = z.discriminatedUnion(
	"status",
	[
		ambiguousResolutionValidationSchema,
		resolvedResolutionValidationSchema,
		unresolvedResolutionValidationSchema,
	],
);

export { resolutionValidationSchema };
