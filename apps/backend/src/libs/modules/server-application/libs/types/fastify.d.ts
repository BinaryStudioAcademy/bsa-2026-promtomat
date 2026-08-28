import { type UserDto } from "./types.js";

declare module "fastify" {
	interface FastifyRequest {
		user: null | UserDto;
	}
}

export {};
