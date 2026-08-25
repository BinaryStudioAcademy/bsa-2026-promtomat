import { type UserDto } from "../../../users/users.js";

type AuthResponseDto = {
	token: string;
	user: UserDto;
};

export { type AuthResponseDto };
