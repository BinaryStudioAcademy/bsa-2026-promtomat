import { z } from "zod";

const resolvedResolution = z.object({
	status: z.literal("resolved"),
	workspaceId: z.number(),
});

export { resolvedResolution };
