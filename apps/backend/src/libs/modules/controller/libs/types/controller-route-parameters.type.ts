import { type preHandlerAsyncHookHandler } from "fastify";

import { type HTTPMethod } from "~/libs/modules/http/http.js";
import { type RouteConfig } from "~/libs/modules/server-application/server-application.js";
import { type ValidationSchema, type ValueOf } from "~/libs/types/types.js";

import { type APIHandler } from "./api-handler.type.js";

type ControllerRouteParameters = {
	config?: RouteConfig;
	handler: APIHandler;
	method: ValueOf<typeof HTTPMethod>;
	path: string;
	preHandler?: preHandlerAsyncHookHandler;
	validation?: {
		body?: ValidationSchema;
		query?: ValidationSchema;
	};
};

export { type ControllerRouteParameters };
