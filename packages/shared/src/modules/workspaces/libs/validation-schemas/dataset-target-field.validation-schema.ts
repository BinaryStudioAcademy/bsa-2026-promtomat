import { z } from "zod";

import { WorkspaceTarget } from "../enums/enums.js";

const datasetTargetField = z.union([
	z.literal(WorkspaceTarget.SMALL),
	z.literal(WorkspaceTarget.MEDIUM),
	z.literal(WorkspaceTarget.LARGE),
	z.literal(WorkspaceTarget.EXTRA_LARGE),
]);

export { datasetTargetField };
