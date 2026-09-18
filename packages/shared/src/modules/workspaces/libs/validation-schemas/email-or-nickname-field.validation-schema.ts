import { z } from "zod";

import {
	WorkspaceValidationMessage,
	WorkspaceValidationRule,
} from "../enums/enums.js";

const emailOrNicknameField = z
	.string()
	.trim()
	.min(WorkspaceValidationRule.EMAIL_OR_NICKNAME_EMPTY_STATE_LENGTH, {
		error: WorkspaceValidationMessage.EMAIL_OR_NICKNAME_REQUIRED,
	})
	.max(WorkspaceValidationRule.EMAIL_OR_NICKNAME_MAXIMUM_LENGTH, {
		error: WorkspaceValidationMessage.EMAIL_OR_NICKNAME_TOO_LONG,
	});

export { emailOrNicknameField };
