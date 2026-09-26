import { ServerIdentity, ToolName } from "~/libs/enums/enums.js";
import { createMCPTextResult } from "~/libs/helpers/helpers.js";
import { type Tool } from "~/libs/types/types.js";

import { type AuthApi } from "./auth-api.js";
import { WHOAMI_DESCRIPTION } from "./libs/constants/constants.js";

const createWhoAmITool = (authApi: AuthApi): Tool => ({
	description: WHOAMI_DESCRIPTION,
	execute: async () => {
		const user = await authApi.getAuthenticatedUser();

		return createMCPTextResult(
			`${ServerIdentity.COMMAND} ${ServerIdentity.VERSION}: authenticated as ${user.nickname} (${user.email}), user id ${String(user.id)}`,
		);
	},
	name: ToolName.WHO_AM_I,
});

export { createWhoAmITool };
