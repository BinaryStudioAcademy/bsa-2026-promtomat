import { z } from "zod";

import { type AuthenticatedUser } from "../types/types.js";

const authenticatedUserValidationSchema: z.ZodType<AuthenticatedUser> =
	z.object({
		email: z.string(),
		id: z.number(),
		nickname: z.string(),
	});

export { authenticatedUserValidationSchema };
