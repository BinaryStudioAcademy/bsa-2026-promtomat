import { ApplicationError } from "../application-error/application-error.exception.js";

type Constructor = {
	cause?: unknown;
	message: string;
};

class AuthError extends ApplicationError {
	public constructor({ cause, message }: Constructor) {
		super({ cause, message });
	}
}

export { AuthError };
