import { type UserDto } from "@promptomat/shared";

declare module "fastify" {
	interface FastifyRequest {
		user: null | UserDto;
	}
}

export {};
