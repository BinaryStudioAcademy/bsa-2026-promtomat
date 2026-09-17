import { z } from "zod";

import { emailFieldValidationSchema } from "../../../auth/auth.js";

const workspaceAddContributor = z.strictObject({
	email: emailFieldValidationSchema,
});

export { workspaceAddContributor };
