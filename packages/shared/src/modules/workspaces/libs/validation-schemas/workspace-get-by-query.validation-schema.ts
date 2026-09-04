import { z } from "zod";

const workspaceGetByQuery = z.object({
	search: z.string().optional(),
});

export { workspaceGetByQuery };
