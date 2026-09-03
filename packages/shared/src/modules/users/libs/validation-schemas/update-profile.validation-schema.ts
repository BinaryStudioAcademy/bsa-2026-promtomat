import { z } from "zod";

import { nicknameFieldValidationSchema } from "../../../auth/auth.js";
import { AiCodingTool } from "../enums/enums.js";

const PRIMARY_AI_CODING_TOOL_REQUIRED = "Select a primary AI coding tool";

const updateProfile = z.object({
	nickname: nicknameFieldValidationSchema,
	primaryAiCodingTool: z.enum(AiCodingTool, {
		error: PRIMARY_AI_CODING_TOOL_REQUIRED,
	}),
});

export { updateProfile };
