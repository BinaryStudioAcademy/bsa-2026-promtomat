import { type z } from "zod";

import { type bindRepositoryInputSchema } from "../validation-schemas/validation-schemas.js";

type BindRepositoryArguments = z.infer<
	z.ZodObject<typeof bindRepositoryInputSchema>
>;

export { type BindRepositoryArguments };
