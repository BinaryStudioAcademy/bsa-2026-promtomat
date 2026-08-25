import { config } from "~/libs/modules/config/config.js";
import { database } from "~/libs/modules/database/database.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { authController } from "~/modules/auth/auth.js";
import { healthController } from "~/modules/health/health.js";
import { userController, userService } from "~/modules/users/users.js";

import { AuthGuard } from "../auth-guard/auth-guard.js";
import { BaseServerApplicationApi } from "./base-server-application-api.js";
import { BaseServerApplication } from "./base-server-application.js";

//TODO: import type Token AFTER merging issue #23
type Token = {
	verify: <T>(token: string) => Promise<T>;
};

//TODO: import token AFTER merging #23
const token: Token = {
	verify: <T>(): Promise<T> => {
		throw new Error("Token module not yet available — mock");
	},
};

const authGuard = new AuthGuard(token, userService);

const apiV1 = new BaseServerApplicationApi(
	"v1",
	config,
	...authController.routes,
	...healthController.routes,
	...userController.routes,
);
const serverApplication = new BaseServerApplication({
	apis: [apiV1],
	authGuard,
	config,
	database,
	logger,
	title: "AI Meeting Assistant",
});

export { serverApplication };
export { type ServerApplicationRouteParameters } from "./libs/types/types.js";
