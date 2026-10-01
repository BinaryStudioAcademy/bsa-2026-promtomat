import { z } from "zod";

import { WorkspaceListScope, WorkspaceListSort } from "../enums/enums.js";

const workspaceGetByQuery = z.strictObject({
	scope: z.enum(WorkspaceListScope).optional(),
	sort: z.enum(WorkspaceListSort).optional(),
	workspaceName: z.string().optional(),
});

export { workspaceGetByQuery };
