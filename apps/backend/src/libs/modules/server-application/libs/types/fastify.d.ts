import { type AuthPayload } from "./auth-payload.type.js";

declare module "fastify" {
	interface FastifyRequest {
		user: AuthPayload | null;
	}
}

export {};
