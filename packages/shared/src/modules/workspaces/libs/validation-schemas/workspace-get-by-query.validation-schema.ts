import { z } from "zod";

import { WorkspaceListScope } from "../enums/enums.js";

const workspaceGetByQuery = z.strictObject({
	scope: z.enum(WorkspaceListScope).optional(),
	workspaceName: z.string().optional(),
});

export { workspaceGetByQuery };
