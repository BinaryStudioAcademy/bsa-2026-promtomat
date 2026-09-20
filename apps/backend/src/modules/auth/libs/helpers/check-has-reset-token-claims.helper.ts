import { TokenPurpose } from "../enums/enums.js";
import {
	type PasswordResetTokenClaims,
	type VerifiedResetTokenClaims,
} from "../types/types.js";

const checkHasResetTokenClaims = (
	claims: PasswordResetTokenClaims,
): claims is VerifiedResetTokenClaims => {
	return (
		claims.purpose === TokenPurpose.PASSWORD_RESET &&
		typeof claims.userId === "number" &&
		claims.iat !== undefined
	);
};

export { checkHasResetTokenClaims };
