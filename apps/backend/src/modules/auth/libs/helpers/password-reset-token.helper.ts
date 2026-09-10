import { createHash, randomBytes } from "node:crypto";

const TOKEN_BYTE_LENGTH = 32;

const createPasswordResetToken = (): string => {
	return randomBytes(TOKEN_BYTE_LENGTH).toString("base64url");
};

const hashPasswordResetToken = (token: string): string => {
	return createHash("sha256").update(token).digest("hex");
};

const hashThrottleKey = (email: string): string => {
	return createHash("sha256").update(email).digest("hex");
};

export { createPasswordResetToken, hashPasswordResetToken, hashThrottleKey };
