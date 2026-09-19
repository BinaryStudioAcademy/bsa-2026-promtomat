import { ApplicationError } from "@promptomat/shared";

import { ExceptionMessage } from "~/libs/enums/enums.js";

type Constructor = {
	cause?: unknown;
	status: number;
};

class UnexpectedResponseError extends ApplicationError {
	public status: number;

	public constructor({ cause, status }: Constructor) {
		super({
			cause,
			message: ExceptionMessage.UNEXPECTED_RESPONSE,
		});

		this.status = status;
	}
}

export { UnexpectedResponseError };
