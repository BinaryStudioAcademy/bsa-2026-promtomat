import { type UserEntity } from "~/modules/users/user.entity.js";

type TokenGuard = {
	authenticate(token: string): Promise<UserEntity>;
};

export { type TokenGuard };
