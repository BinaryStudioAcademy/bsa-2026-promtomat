import { AuthValidationRule } from "../../../auth/auth.js";

const WorkspaceValidationRule = {
	EMAIL_OR_NICKNAME_EMPTY_STATE_LENGTH: 1,
	EMAIL_OR_NICKNAME_MAXIMUM_LENGTH: AuthValidationRule.EMAIL_MAXIMUM_LENGTH,
	NAME_MAXIMUM_LENGTH: 50,
	NAME_MINIMUM_LENGTH: 3,
	NAME_REGEX:
		/^(?=.*\p{Script=Latin})(?:[^\p{L}\p{Extended_Pictographic}]|\p{Script=Latin})*$/u,
} as const;

export { WorkspaceValidationRule };
