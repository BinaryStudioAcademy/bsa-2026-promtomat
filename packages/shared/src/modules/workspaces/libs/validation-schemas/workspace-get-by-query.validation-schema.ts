import { z } from "zod";

const workspaceGetByQuery = z.object({
	workspaceName: z.string().optional(),
});

export { workspaceGetByQuery };
