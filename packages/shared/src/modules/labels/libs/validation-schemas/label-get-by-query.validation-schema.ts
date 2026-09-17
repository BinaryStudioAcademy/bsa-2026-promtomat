import { z } from "zod";

const labelGetByQuery = z.object({
	workspaceId: z.coerce.number().int().positive(),
});

export { labelGetByQuery };
