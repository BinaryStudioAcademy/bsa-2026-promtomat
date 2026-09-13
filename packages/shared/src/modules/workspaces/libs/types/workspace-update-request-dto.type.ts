import { z } from "zod";

import { workspaceUpdateValidationSchema } from "../validation-schemas/validation-schemas.js";

type WorkspaceUpdateRequestDto = z.infer<
	typeof workspaceUpdateValidationSchema
>;

export { type WorkspaceUpdateRequestDto };
