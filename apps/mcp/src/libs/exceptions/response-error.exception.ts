import { ApplicationError } from "@promptomat/shared";

type Constructor = {
	cause?: unknown;
	code: string;
	message: string;
	status: number;
};

class ResponseError extends ApplicationError {
	public code: string;

	public status: number;

	public constructor({ cause, code, message, status }: Constructor) {
		super({
			cause,
			message,
		});

		this.code = code;
		this.status = status;
	}
}

export { ResponseError };
