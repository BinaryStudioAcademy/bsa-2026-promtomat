import { z } from "zod";

const resolveRepository = {
	remoteName: z
		.string()
		.optional()
		.describe(
			"The git remote to use, needed only when a prior call reported more than one distinct repository among the configured remotes.",
		),
};

export { resolveRepository };
