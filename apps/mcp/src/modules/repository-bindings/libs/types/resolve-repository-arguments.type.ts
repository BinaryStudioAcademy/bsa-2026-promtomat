import { type z } from "zod";

import { type resolveRepositoryInputSchema } from "../validation-schemas/validation-schemas.js";

type ResolveRepositoryArguments = z.infer<
	z.ZodObject<typeof resolveRepositoryInputSchema>
>;

export { type ResolveRepositoryArguments };
