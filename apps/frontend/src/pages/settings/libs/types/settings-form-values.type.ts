import { type UserUpdateRequestDto } from "~/modules/users/users.js";

type SettingsFormValues = {
	nickname: UserUpdateRequestDto["nickname"];
	primaryAiCodingTool: "" | UserUpdateRequestDto["primaryAiCodingTool"];
};

export { type SettingsFormValues };
