import { z } from "zod";

const createRepositoryBinding = z.strictObject({
	remoteUrl: z.string().trim().min(1),
	workspaceId: z.number().int().positive(),
});

export { createRepositoryBinding };
