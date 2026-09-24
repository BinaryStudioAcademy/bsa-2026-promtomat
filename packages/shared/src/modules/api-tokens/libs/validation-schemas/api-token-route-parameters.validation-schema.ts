import { z } from "zod";

import { ApiTokenValidationMessage } from "../enums/enums.js";

const apiTokenRouteParametersValidationSchema = z.object({
	id: z.uuid(ApiTokenValidationMessage.ID_INVALID),
});

export { apiTokenRouteParametersValidationSchema };
