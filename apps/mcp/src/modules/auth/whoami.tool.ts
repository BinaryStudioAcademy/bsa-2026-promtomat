import { ServerIdentity, ToolName } from "~/libs/enums/enums.js";
import { type Tool } from "~/libs/types/types.js";

import { type AuthApi } from "./auth-api.js";

const DESCRIPTION =
	"Report which Promptomat user this server is authenticated as. Call it to verify the connection and the API token before using other Promptomat tools, or when a Promptomat call fails with an authentication error. Takes no arguments.";

const createWhoAmITool = (authApi: AuthApi): Tool => ({
	description: DESCRIPTION,
	execute: async () => {
		const user = await authApi.getAuthenticatedUser();

		return {
			content: [
				{
					text: `${ServerIdentity.COMMAND} ${ServerIdentity.VERSION}: authenticated as ${user.nickname} (${user.email}), user id ${String(user.id)}`,
					type: "text",
				},
			],
		};
	},
	name: ToolName.WHO_AM_I,
});

export { createWhoAmITool };
