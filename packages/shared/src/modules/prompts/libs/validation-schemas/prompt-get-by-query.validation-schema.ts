import { z } from "zod";

const promptGetByQuery = z.object({
	labelId: z.coerce.number().int().positive().optional(),
	workspaceId: z.coerce.number().int().positive(),
});

export { promptGetByQuery };
