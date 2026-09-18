import { z } from "zod";

import { emailOrNicknameField } from "./email-or-nickname-field.validation-schema.js";

const workspaceAddContributor = z.strictObject({
	emailOrNickname: emailOrNicknameField,
});

export { workspaceAddContributor };
