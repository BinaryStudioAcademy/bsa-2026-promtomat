import { ApplicationError } from "@promptomat/shared";

type Constructor = {
	cause?: unknown;
	message: string;
};

class UnreachableError extends ApplicationError {
	public constructor({ cause, message }: Constructor) {
		super({
			cause,
			message,
		});
	}
}

export { UnreachableError };
