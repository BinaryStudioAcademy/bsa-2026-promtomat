import { z } from "zod";

import { nicknameFieldValidationSchema } from "../../../auth/auth.js";
import { AiCodingTool } from "../enums/enums.js";

const updateProfile = z.object({
	nickname: nicknameFieldValidationSchema,
	primaryAiCodingTool: z.enum(AiCodingTool),
});

export { updateProfile };
