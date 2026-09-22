import { type PasswordPayload } from "./password-payload.type.js";

type ResetPasswordPayload = PasswordPayload & {
	issuedAt: Date;
};

export { type ResetPasswordPayload };
