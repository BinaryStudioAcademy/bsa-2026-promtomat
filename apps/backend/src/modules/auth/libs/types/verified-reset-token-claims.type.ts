import { type TokenPurpose } from "../enums/enums.js";

type VerifiedResetTokenClaims = {
	iat: number;
	purpose: typeof TokenPurpose.PASSWORD_RESET;
	userId: number;
};

export { type VerifiedResetTokenClaims };
