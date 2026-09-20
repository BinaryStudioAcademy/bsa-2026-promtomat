import { z } from "zod";

import { promptRouteParametersValidationSchema } from "../validation-schemas/validation-schemas.js";

type PromptRouteParametersDto = z.infer<
	typeof promptRouteParametersValidationSchema
>;

export { type PromptRouteParametersDto };
