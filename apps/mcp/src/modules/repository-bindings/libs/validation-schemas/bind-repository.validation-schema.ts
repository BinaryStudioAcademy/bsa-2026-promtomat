import { z } from "zod";

const bindRepository = {
	workspaceId: z
		.number()
		.int()
		.positive()
		.describe("The id of the workspace to bind this repository to."),
};

export { bindRepository };
