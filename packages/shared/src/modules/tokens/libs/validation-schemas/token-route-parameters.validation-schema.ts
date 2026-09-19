import { z } from "zod";

import { TokenValidationMessage } from "../enums/enums.js";

const tokenRouteParametersValidationSchema = z.object({
	id: z.uuid(TokenValidationMessage.ID_INVALID),
});

export { tokenRouteParametersValidationSchema };
