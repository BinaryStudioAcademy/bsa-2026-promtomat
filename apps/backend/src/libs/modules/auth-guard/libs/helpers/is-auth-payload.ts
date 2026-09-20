import { AuthPayload } from "../types/auth-payload.type.js";

const isAuthPayload = (
	payload: Partial<AuthPayload>,
): payload is AuthPayload => {
	return payload.iat != null && payload.userId != null;
};

export { isAuthPayload };
