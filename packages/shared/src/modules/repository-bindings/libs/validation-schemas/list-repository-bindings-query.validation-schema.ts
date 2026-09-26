import { z } from "zod";

const listRepositoryBindingsQuery = z.strictObject({
	workspaceId: z.coerce.number().int().positive(),
});

export { listRepositoryBindingsQuery };
