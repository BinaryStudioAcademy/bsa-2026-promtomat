import {
	type FastifyReply,
	type FastifyRequest,
	type preHandlerAsyncHookHandler,
} from "fastify";

import { type HTTPMethod } from "~/libs/modules/http/http.js";
import { type ValidationSchema, type ValueOf } from "~/libs/types/types.js";

import { type RouteConfig } from "./route-config.type.js";

type ServerApplicationRouteParameters = {
	config?: RouteConfig;
	handler: (
		request: FastifyRequest,
		reply: FastifyReply,
	) => Promise<void> | void;
	method: ValueOf<typeof HTTPMethod>;
	path: string;
	preHandler?: preHandlerAsyncHookHandler;
	validation?: {
		body?: ValidationSchema;
		params?: ValidationSchema;
		query?: ValidationSchema;
	};
};

export { type ServerApplicationRouteParameters };
