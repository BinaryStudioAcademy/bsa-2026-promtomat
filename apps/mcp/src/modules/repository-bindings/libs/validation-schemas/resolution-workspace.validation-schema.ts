import { z } from "zod";

const resolutionWorkspace = z.object({
	id: z.number(),
	name: z.string(),
});

export { resolutionWorkspace };
