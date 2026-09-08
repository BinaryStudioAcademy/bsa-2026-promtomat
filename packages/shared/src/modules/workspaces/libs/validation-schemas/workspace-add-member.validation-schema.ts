import { z } from "zod";

const workspaceAddMember = z.object({
	userId: z.number().int().positive(),
});

export { workspaceAddMember };
