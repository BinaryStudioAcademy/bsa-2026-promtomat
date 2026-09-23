import { z } from "zod";

const unresolvedResolution = z.object({
	status: z.literal("unresolved"),
});

export { unresolvedResolution };
