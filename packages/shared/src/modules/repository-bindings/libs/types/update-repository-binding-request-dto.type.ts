import { type z } from "zod";

import { type repositoryBindingUpdate } from "../validation-schemas/validation-schemas.js";

type UpdateRepositoryBindingRequestDto = z.infer<
	typeof repositoryBindingUpdate
>;

export { type UpdateRepositoryBindingRequestDto };
