import { z } from "zod";

const resolveRepositoryBindingQuery = z.strictObject({
	remoteUrl: z.string().trim().min(1),
});

export { resolveRepositoryBindingQuery };
