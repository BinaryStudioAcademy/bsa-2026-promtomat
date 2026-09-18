import { type z } from "zod";

import { type repositoryBindingCreation } from "../validation-schemas/validation-schemas.js";

type CreateRepositoryBindingRequestDto = z.infer<
	typeof repositoryBindingCreation
>;

export { type CreateRepositoryBindingRequestDto };
