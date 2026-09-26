import { z } from "zod";

const bindRepository = {
	remoteName: z
		.string()
		.optional()
		.describe(
			"The git remote to use, needed only when a prior call reported more than one distinct repository among the configured remotes.",
		),
	workspaceId: z
		.number()
		.int()
		.positive()
		.describe("The id of the workspace to bind this repository to."),
};

export { bindRepository };
