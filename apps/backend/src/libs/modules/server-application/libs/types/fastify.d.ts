import { type UserDto } from "~/modules/users/libs/types/types.js";

declare module "fastify" {
	interface FastifyRequest {
		user: null | UserDto;
	}
}

export {};
