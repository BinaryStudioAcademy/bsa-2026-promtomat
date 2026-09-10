import {
	type FastifyReply,
	type FastifyRequest,
	type preHandlerAsyncHookHandler,
} from "fastify";

import { type HTTPMethod } from "~/libs/modules/http/http.js";
import { type ValidationSchema, type ValueOf } from "~/libs/types/types.js";

type ServerApplicationRouteParameters = {
	handler: (
		request: FastifyRequest,
		reply: FastifyReply,
	) => Promise<void> | void;
	method: ValueOf<typeof HTTPMethod>;
	path: string;
	preHandler?: preHandlerAsyncHookHandler;
	validation?: {
		body?: ValidationSchema;
		query?: ValidationSchema;
	};
};

export { type ServerApplicationRouteParameters };
