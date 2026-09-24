import { type UserDto } from "~/libs/types/types.js";

type AuthenticatedUser = Pick<UserDto, "email" | "id" | "nickname">;

export { type AuthenticatedUser };
