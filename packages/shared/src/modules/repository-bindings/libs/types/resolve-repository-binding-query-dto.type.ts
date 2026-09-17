import { type z } from "zod";

import { type resolveRepositoryBindingQuery } from "../validation-schemas/validation-schemas.js";

type ResolveRepositoryBindingQueryDto = z.infer<
	typeof resolveRepositoryBindingQuery
>;

export { type ResolveRepositoryBindingQueryDto };
