import { type z } from "zod";

import { type listRepositoryBindingsQuery } from "../validation-schemas/validation-schemas.js";

type ListRepositoryBindingsQueryDto = z.infer<
	typeof listRepositoryBindingsQuery
>;

export { type ListRepositoryBindingsQueryDto };
