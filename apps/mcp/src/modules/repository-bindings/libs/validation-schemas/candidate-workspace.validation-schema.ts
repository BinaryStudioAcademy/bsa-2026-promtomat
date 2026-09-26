import { z } from "zod";

const candidateWorkspace = z.object({
	id: z.number(),
	name: z.string(),
});

export { candidateWorkspace };
