import { type TokenPurpose } from "../enums/enums.js";

type PasswordResetTokenPayload = {
	purpose: typeof TokenPurpose.PASSWORD_RESET;
	userId: number;
};

export { type PasswordResetTokenPayload };
