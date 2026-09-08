import { z } from "zod";

import {
	WorkspaceValidationMessage,
	WorkspaceVisibility,
} from "../enums/enums.js";

const visibilityField = z.enum(WorkspaceVisibility, {
	error: WorkspaceValidationMessage.VISIBILITY_INVALID,
});

export { visibilityField };
