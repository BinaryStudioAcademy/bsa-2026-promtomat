import { z } from "zod";

import { AuthValidationMessage } from "../enums/enums.js";

const passwordBoundarySpaces = z
	.string()
	.refine((value) => value === value.trim(), {
		error: AuthValidationMessage.PASSWORD_HAS_LEADING_OR_TRAILING_SPACES,
	});

export { passwordBoundarySpaces };
