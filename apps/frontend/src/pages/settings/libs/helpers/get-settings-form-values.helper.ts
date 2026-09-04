import { type UserDto } from "~/modules/users/users.js";

import { EMPTY_AI_CODING_TOOL } from "../constants.js";
import { type SettingsFormValues } from "../types/types.js";

const getSettingsFormValues = (user: UserDto): SettingsFormValues => {
	return {
		nickname: user.nickname,
		primaryAiCodingTool: user.primaryAiCodingTool ?? EMPTY_AI_CODING_TOOL,
	};
};

export { getSettingsFormValues };
