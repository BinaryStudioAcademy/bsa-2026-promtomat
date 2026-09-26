import { config } from "~/libs/modules/config/config.js";
import { database } from "~/libs/modules/database/database.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { analyticsController } from "~/modules/analytics/analytics.js";
import {
	apiTokenController,
	apiTokenService,
} from "~/modules/api-tokens/api-tokens.js";
import { authController } from "~/modules/auth/auth.js";
import { composedPromptController } from "~/modules/composed-prompts/composed-prompts.js";
import { contributorController } from "~/modules/contributors/contributors.js";
import { healthController } from "~/modules/health/health.js";
import { labelController } from "~/modules/labels/labels.js";
import { promptController } from "~/modules/prompts/prompts.js";
import { repositoryBindingController } from "~/modules/repository-bindings/repository-bindings.js";
import { userController, userService } from "~/modules/users/users.js";
import { workspaceController } from "~/modules/workspaces/workspaces.js";

import {
	ApiTokenGuard,
	AuthGuard,
	JwtTokenGuard,
} from "../auth-guard/auth-guard.js";
import { token } from "../token/token.js";
import { BaseServerApplicationApi } from "./base-server-application-api.js";
import { BaseServerApplication } from "./base-server-application.js";

const apiTokenGuard = new ApiTokenGuard(apiTokenService, userService);
const jwtTokenGuard = new JwtTokenGuard(token, userService);
const authGuard = new AuthGuard(apiTokenGuard, jwtTokenGuard);

const apiV1 = new BaseServerApplicationApi(
	"v1",
	config,
	...apiTokenController.routes,
	...analyticsController.routes,
	...authController.routes,
	...contributorController.routes,
	...composedPromptController.routes,
	...healthController.routes,
	...labelController.routes,
	...userController.routes,
	...promptController.routes,
	...repositoryBindingController.routes,
	...workspaceController.routes,
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
export {
	type RouteConfig,
	type ServerApplicationRouteParameters,
} from "./libs/types/types.js";
