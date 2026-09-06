import { z } from "zod";

import { workspaceCreationValidationSchema } from "../validation-schemas/validation-schemas.js";

type WorkspaceCreateRequestDto = z.infer<
	typeof workspaceCreationValidationSchema
>;

export { type WorkspaceCreateRequestDto };
