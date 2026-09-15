import { z } from "zod";

const workspaceAddContributor = z.strictObject({
	userId: z.number().int().positive(),
});

export { workspaceAddContributor };
