import { z } from "zod";

import { nicknameFieldValidationSchema } from "../../../auth/auth.js";
import { AiCodingTool, UserValidationMessage } from "../enums/enums.js";

const updateProfile = z.object({
	nickname: nicknameFieldValidationSchema,
	primaryAiCodingTool: z.enum(AiCodingTool, {
		error: UserValidationMessage.PRIMARY_AI_CODING_TOOL_REQUIRED,
	}),
});

export { updateProfile };
