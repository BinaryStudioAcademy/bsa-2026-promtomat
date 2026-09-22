import { type FastifyRequest } from "fastify";

type RouteConfig = {
	rateLimit?: {
		keyGenerator?: (request: FastifyRequest) => string;
		max?: number;
		timeWindow?: number | string;
	};
};

export { type RouteConfig };
